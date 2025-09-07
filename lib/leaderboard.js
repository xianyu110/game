// Lightweight localStorage-based leaderboard utility
// Usage:
//  - LB.record({key:'2048', difficulty:'normal', score: 1234, better:'desc', unit:'分', meta:{}})
//  - LB.show({key:'2048', difficulty:'normal', better:'desc', unit:'分'})
//  - LB.setName('player') / LB.getName()
//  - LB.clear({key:'2048'})
(function(){
  const NS = 'lb_v1';
  const ensureStore = () => { try { if(!localStorage.getItem(NS)) localStorage.setItem(NS, JSON.stringify({})); } catch(e) {} };
  const read = () => { ensureStore(); try { return JSON.parse(localStorage.getItem(NS)||'{}'); } catch(e){ return {}; } };
  const write = (obj) => { try { localStorage.setItem(NS, JSON.stringify(obj)); } catch(e){} };
  const getName = () => { try { return localStorage.getItem('lb_name')||''; } catch(e){ return ''; } };
  const setName = (n) => { try { localStorage.setItem('lb_name', n||''); } catch(e){} };

  function record({key, difficulty, score, better='desc', unit='', meta}){
    if(!key) return;
    const name = getName() || prompt('请输入你的昵称（用于排行榜）：') || '玩家';
    if(!getName()) setName(name);
    const db = read();
    const arr = db[key] || [];
    arr.push({n:name, d:difficulty||'', s:Number(score)||0, u:unit||'', t:Date.now(), m: meta||{}});
    arr.sort((a,b)=> better==='asc' ? (a.s-b.s || a.t-b.t) : (b.s-a.s || a.t-b.t));
    db[key] = arr.slice(0, 20);
    write(db);
  }

  function clear({key}){
    const db = read();
    db[key] = [];
    write(db);
  }

  function fmtTime(ms){
    const s = Math.round(ms/1000);
    const m = Math.floor(s/60), r = s%60;
    return (m? m+'分':'') + r + '秒';
  }

  function show({key, difficulty, better='desc', unit='', title}){
    const db = read();
    const all = (db[key]||[]).filter(x=> !difficulty || x.d===difficulty);
    const name = getName();

    // inject styles once
    if(!document.getElementById('lb-styles')){
      const css = `#lb-mask{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:9999}
      #lb-panel{background:#fff;color:#222;min-width:320px;max-width:92vw;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);overflow:hidden;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
      #lb-panel header{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid #eee}
      #lb-panel h3{margin:0;font-size:16px}
      #lb-panel .close{cursor:pointer;border:none;background:transparent;font-size:18px}
      #lb-panel .inner{padding:10px 14px}
      #lb-panel table{width:100%;border-collapse:collapse}
      #lb-panel th,#lb-panel td{padding:8px;border-bottom:1px solid #f0f0f0;text-align:left;font-size:14px}
      #lb-panel footer{display:flex;gap:8px;justify-content:space-between;align-items:center;padding:10px 14px;border-top:1px solid #eee}
      #lb-panel input{padding:6px 8px;border:1px solid #ccc;border-radius:8px}
      #lb-panel button{padding:6px 10px;border:1px solid #bbb;border-radius:8px;background:#fff;cursor:pointer}
      @media (prefers-color-scheme: dark){#lb-panel{background:#1e1f24;color:#e6e6e6} #lb-panel header,#lb-panel footer{border-color:#333} #lb-panel th,#lb-panel td{border-color:#2a2b31} #lb-panel input{background:#111;color:#eee;border-color:#333} #lb-panel button{background:#111;color:#ddd;border-color:#333}}
      `;
      const st = document.createElement('style'); st.id='lb-styles'; st.textContent=css; document.head.appendChild(st);
    }
    const mask = document.createElement('div'); mask.id='lb-mask';
    const panel = document.createElement('div'); panel.id='lb-panel';
    const h = document.createElement('header');
    const hh = document.createElement('h3'); hh.textContent = (title||'排行榜') + (difficulty? `（${difficulty}）` : '');
    const close = document.createElement('button'); close.className='close'; close.textContent='×'; close.onclick=()=>mask.remove();
    h.appendChild(hh); h.appendChild(close);
    const inner = document.createElement('div'); inner.className='inner';
    const table = document.createElement('table');
    const thead = document.createElement('thead'); thead.innerHTML = `<tr><th>#</th><th>昵称</th><th>成绩</th><th>难度</th><th>时间</th></tr>`;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    const fmtScore = (s) => unit==='ms' ? fmtTime(s) : (s + (unit?(' '+unit):''));
    all.slice(0,10).forEach((r,idx)=>{
      const tr = document.createElement('tr');
      const date = new Date(r.t);
      tr.innerHTML = `<td>${idx+1}</td><td>${r.n||'玩家'}</td><td>${fmtScore(r.s)}</td><td>${r.d||'-'}</td><td>${date.toLocaleString()}</td>`;
      tbody.appendChild(tr);
    });
    if(all.length===0){ const tr=document.createElement('tr'); tr.innerHTML='<td colspan="5" style="text-align:center;color:#777">暂无记录</td>'; tbody.appendChild(tr); }
    table.appendChild(tbody);
    inner.appendChild(table);
    const footer = document.createElement('footer');
    const left = document.createElement('div');
    const nameInput = document.createElement('input'); nameInput.placeholder='设置昵称'; nameInput.value = name; nameInput.onchange=()=>setName(nameInput.value.trim());
    left.appendChild(nameInput);
    const right = document.createElement('div');
    const btnClear = document.createElement('button'); btnClear.textContent='清空本游戏记录'; btnClear.onclick=()=>{ if(confirm('确定清空本地排行榜？')){ clear({key}); mask.remove(); show({key,difficulty,better,unit,title}); }};
    const btnClose = document.createElement('button'); btnClose.textContent='关闭'; btnClose.onclick=()=>mask.remove();
    right.appendChild(btnClear); right.appendChild(btnClose);
    footer.appendChild(left); footer.appendChild(right);
    panel.appendChild(h); panel.appendChild(inner); panel.appendChild(footer);
    mask.appendChild(panel); document.body.appendChild(mask);
  }

  window.LB = { record, show, clear, setName, getName };
})();

