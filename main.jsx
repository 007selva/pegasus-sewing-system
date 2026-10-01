import React,{useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {
 LayoutDashboard,Users,Building2,Cog,Package,Layers3,FileText,RefreshCcw,
 BarChart3,Settings,ChevronDown,ChevronRight,Menu,Search,Plus,Eye,Pencil,
 Trash2,Save,ArrowLeft,Lock,Calculator,UserCog,LogOut,CheckCircle2,Printer,
 X,ShieldCheck,CircleDollarSign
} from "lucide-react";
import "./styles.css";

const money=n=>"$"+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const today="30 Sep 2026";

const initial={
 users:[
  {id:1,username:"admin",employee:"Admin User",password:"••••••",permissions:"All modules"},
  {id:2,username:"selvapandi",employee:"Selva Pandi",password:"••••••",permissions:"View + Edit"}
 ],
 customers:[
  {id:1,name:"ABC Garments",company:"ABC Garments Pvt Ltd",phone:"9876543210",email:"purchase@abc.com",address:"Coimbatore"},
  {id:2,name:"Venus Textiles",company:"Venus Textiles Solutions",phone:"9876501234",email:"sales@venus.com",address:"Coimbatore"}
 ],
 machines:[
  {id:1,model:"Pegasus EX Series",code:"PEG-EX-01",rate:5000,lastSold:4700},
  {id:2,model:"Pegasus M Series",code:"PEG-M-02",rate:4200,lastSold:4000},
  {id:3,model:"Pegasus S Series",code:"PEG-S-03",rate:3500,lastSold:3300}
 ],
 parts:[
  {id:1,name:"Motor",rate:500},
  {id:2,name:"Table",rate:300},
  {id:3,name:"Stand",rate:200}
 ],
 groupings:[
  {id:1,machineCode:"PEG-EX-01",parts:[{name:"Motor",rate:500},{name:"Table",rate:300},{name:"Stand",rate:200}],comboTotal:6000},
  {id:2,machineCode:"PEG-M-02",parts:[{name:"Motor",rate:500},{name:"Stand",rate:200}],comboTotal:4900},
  {id:3,machineCode:"PEG-S-03",parts:[{name:"Motor",rate:500},{name:"Table",rate:300}],comboTotal:4300}
 ],
 descriptions:[
  {id:1,text:"3 Needles"},
  {id:2,text:"2 Needles"},
  {id:3,text:"1 Needle"}
 ],
 pis:[
  {id:1001,no:"PI-2026-001",date:"28 Sep 2026",customerId:1,items:[
   {si:1,machineCode:"PEG-EX-01",qty:2,rate:5000,description:"3 Needles"},
   {si:2,machineCode:"PEG-M-02",qty:1,rate:4200,description:"2 Needles"}
  ],status:"Draft"},
  {id:1002,no:"PI-2026-002",date:"29 Sep 2026",customerId:2,items:[
   {si:1,machineCode:"PEG-S-03",qty:2,rate:3500,description:"1 Needle"}
  ],status:"Converted"}
 ],
 conversions:[
  {piId:1002,salePrice:8500,commissions:[{name:"Sales Person",pct:2}],finalized:false}
 ]
};

function App(){
 const [db,setDb]=useState(initial);
 const [page,setPage]=useState("dashboard");
 const [sidebar,setSidebar]=useState(true);
 const [master,setMaster]=useState(true);
 const [modal,setModal]=useState(null);
 const [selected,setSelected]=useState(null);
 const [toast,setToast]=useState("");
 const notify=m=>{setToast(m);setTimeout(()=>setToast(""),2200)};
 const nav=p=>{setPage(p);setSelected(null)};
 const customer=id=>db.customers.find(c=>c.id===id);
 const machine=code=>db.machines.find(m=>m.code===code);
 const grouping=code=>db.groupings.find(g=>g.machineCode===code);
 const piTotal=pi=>pi.items.reduce((s,i)=>s+i.qty*i.rate,0);

 const addMaster=(type,row)=>{
  const map={user:"users",customer:"customers",machine:"machines",part:"parts",grouping:"groupings",description:"descriptions"};
  setDb(d=>({...d,[map[type]]:[{id:Date.now(),...row},...d[map[type]]] }));
  setModal(null);notify("Saved successfully");
 };
 const updateMaster=(type,id,row)=>{
  const map={user:"users",customer:"customers",machine:"machines",part:"parts",grouping:"groupings",description:"descriptions"};
  setDb(d=>({...d,[map[type]]:d[map[type]].map(x=>x.id===id?{...x,...row}:x)}));
  setModal(null);notify("Updated successfully");
 };
 const deleteMaster=(type,id)=>{
  const map={user:"users",customer:"customers",machine:"machines",part:"parts",grouping:"groupings",description:"descriptions"};
  if(!confirm("Delete this record?")) return;
  setDb(d=>({...d,[map[type]]:d[map[type]].filter(x=>x.id!==id)}));notify("Deleted");
 };
 const savePI=pi=>{
  setDb(d=>{
   const exists=d.pis.some(x=>x.id===pi.id);
   return {...d,pis:exists?d.pis.map(x=>x.id===pi.id?pi:x):[pi,...d.pis]};
  });
  notify("PI saved");nav("pi-list");
 };
 const saveConversion=(conv)=>{
  setDb(d=>({...d,conversions:[...d.conversions.filter(x=>x.piId!==conv.piId),conv]}));
  notify("Conversion saved");nav("conversion-list");
 };

 return <div className="app">
  <aside className={"sidebar "+(!sidebar?"collapsed":"")}>
   <div className="brand"><div className="brand-mark">P</div>{sidebar&&<div><b>PEGASUS</b><span>Business System</span></div>}</div>
   <nav>
    <Nav icon={<LayoutDashboard/>} text="Dashboard" active={page==="dashboard"} collapsed={!sidebar} onClick={()=>nav("dashboard")}/>
    <button className={"nav "+(page.startsWith("master")?"active":"")} onClick={()=>setMaster(!master)}><Settings/><span>Master Module</span>{sidebar&&(master?<ChevronDown/>:<ChevronRight/>)}</button>
    {sidebar&&master&&<div className="sub">
      <Nav icon={<Users/>} text="User Management" active={page==="master-users"} sub onClick={()=>nav("master-users")}/>
      <Nav icon={<Building2/>} text="Customer Master" active={page==="master-customers"} sub onClick={()=>nav("master-customers")}/>
      <Nav icon={<Cog/>} text="Machine Model" active={page==="master-machines"} sub onClick={()=>nav("master-machines")}/>
      <Nav icon={<Package/>} text="Parts" active={page==="master-parts"} sub onClick={()=>nav("master-parts")}/>
      <Nav icon={<Layers3/>} text="Grouping / Combo" active={page==="master-groupings"} sub onClick={()=>nav("master-groupings")}/>
      <Nav icon={<FileText/>} text="Description" active={page==="master-descriptions"} sub onClick={()=>nav("master-descriptions")}/>
    </div>}
    <Nav icon={<FileText/>} text="Proforma Invoice" active={page.startsWith("pi-")} collapsed={!sidebar} onClick={()=>nav("pi-list")}/>
    <Nav icon={<RefreshCcw/>} text="PI Conversion" active={page.startsWith("conversion")} collapsed={!sidebar} onClick={()=>nav("conversion-list")}/>
    <Nav icon={<BarChart3/>} text="Reports" active={page.startsWith("report")} collapsed={!sidebar} onClick={()=>nav("report-pi")}/>
   </nav>
   {sidebar&&<div className="side-user"><div className="avatar">AU</div><div><b>Admin User</b><span>Administrator</span></div></div>}
  </aside>
  <main className="main">
   <header><button className="hamb" onClick={()=>setSidebar(!sidebar)}><Menu/></button><div className="global-search"><Search/><input placeholder="Search current screen..."/></div><div className="profile"><div className="avatar sm">AU</div> Admin User <ChevronDown size={15}/></div></header>
   <div className="content">
    <div className="crumb">Home <ChevronRight size={14}/><b>{label(page)}</b></div>

    {page==="dashboard"&&<Dashboard db={db} nav={nav} piTotal={piTotal} customer={customer}/>}
    {page.startsWith("master-")&&<MasterPage type={page.replace("master-","")} db={db} open={(type,row)=>setModal({mode:row?"edit":"add",type,row})} remove={deleteMaster}/>}
    {page==="pi-list"&&<PIList db={db} nav={nav} customer={customer} piTotal={piTotal} onNew={()=>{setSelected(null);nav("pi-edit")}} onEdit={id=>{setSelected(id);nav("pi-edit")}}/>}
    {page==="pi-edit"&&<PIEditor db={db} piId={selected} customer={customer} machine={machine} onBack={()=>nav("pi-list")} onSave={savePI}/>}
    {page==="pi-view"&&<PIView db={db} piId={selected} customer={customer} machine={machine} grouping={grouping} piTotal={piTotal} onBack={()=>nav("pi-list")}/>}
    {page==="conversion-list"&&<ConversionList db={db} customer={customer} piTotal={piTotal} onOpen={id=>{setSelected(id);nav("conversion-edit")}}/>}
    {page==="conversion-edit"&&<ConversionEditor db={db} piId={selected} customer={customer} machine={machine} grouping={grouping} piTotal={piTotal} existing={db.conversions.find(x=>x.piId===selected)} onBack={()=>nav("conversion-list")} onSave={saveConversion}/>}
    {page==="report-pi"&&<ReportPage title="PI Report" converted={false} db={db} customer={customer} piTotal={piTotal} onView={id=>{setSelected(id);nav("pi-view")}}/>}
    {page==="report-converted"&&<ReportPage title="Converted PI Report" converted db={db} customer={customer} piTotal={piTotal} onView={id=>{setSelected(id);nav("conversion-edit")}}/>}
   </div>
  </main>
  {modal&&<MasterModal state={modal} close={()=>setModal(null)} save={modal.mode==="edit"?updateMaster:addMaster} db={db}/>}
  {toast&&<div className="toast"><CheckCircle2/> {toast}</div>}
 </div>
}

function label(p){return ({dashboard:"Dashboard","master-users":"User Management","master-customers":"Customer Master","master-machines":"Machine Model","master-parts":"Parts","master-groupings":"Grouping / Combo","master-descriptions":"Description","pi-list":"Proforma Invoice","pi-edit":"Create / Edit PI","pi-view":"PI View","conversion-list":"PI Conversion","conversion-edit":"Conversion Details","report-pi":"PI Report","report-converted":"Converted PI Report"})[p]||"Dashboard"}
function Nav({icon,text,active,onClick,sub,collapsed}){return <button className={"nav "+(active?"active ":"")+(sub?"subnav":"")} onClick={onClick} title={collapsed?text:""}>{icon}{!collapsed&&<span>{text}</span>}</button>}

function Dashboard({db,nav,piTotal,customer}){
 const converted=db.pis.filter(p=>p.status==="Converted").length;
 const total=db.pis.reduce((s,p)=>s+piTotal(p),0);
 return <><div className="hero"><div><h1>Dashboard</h1><p>Manage customers, machines, proforma invoices and conversions.</p></div><button className="primary" onClick={()=>nav("pi-edit")}><Plus/> Create PI</button></div>
 <div className="stats">{[
  ["Customers",db.customers.length,<Building2/>],["Machine Models",db.machines.length,<Cog/>],["Proforma Invoices",db.pis.length,<FileText/>],["Converted PIs",converted,<RefreshCcw/>]
 ].map(x=><div className="stat card" key={x[0]}><div className="stat-icon">{x[2]}</div><div><span>{x[0]}</span><strong>{x[1]}</strong></div></div>)}</div>
 <div className="grid2"><section className="card"><Head title="Recent Proforma Invoices" action="View all" onClick={()=>nav("pi-list")}/><Table rows={db.pis.slice(0,5).map(p=>({no:p.no,date:p.date,customer:customer(p.customerId)?.name,total:money(piTotal(p)),status:p.status}))} cols={["PI No.","Date","Customer","Total","Status"]} keys={["no","date","customer","total","status"]}/></section>
 <section className="card quick"><h2>Quick Actions</h2><button onClick={()=>nav("master-customers")}><Building2/> Add Customer</button><button onClick={()=>nav("master-machines")}><Cog/> Manage Machines</button><button onClick={()=>nav("pi-edit")}><FileText/> Create Proforma Invoice</button><button onClick={()=>nav("conversion-list")}><RefreshCcw/> Convert PI</button></section></div></>
}
function Head({title,action,onClick}){return <div className="head"><div><h2>{title}</h2><p>Latest records and activity</p></div>{action&&<button className="link" onClick={onClick}>{action}</button>}</div>}

const masterCfg={
 users:{title:"User Management",subtitle:"Create users and assign module permissions.",icon:<UserCog/>,add:"Add User",cols:["User Name","Employee Name","Permissions"],keys:["username","employee","permissions"]},
 customers:{title:"Customer Master",subtitle:"Create and maintain customer details.",icon:<Building2/>,add:"Add Customer",cols:["Customer Name","Company Name","Phone","Email"],keys:["name","company","phone","email"]},
 machines:{title:"Machine Model",subtitle:"Manage machine models, codes and predefined rates.",icon:<Cog/>,add:"Add Machine",cols:["Model","Machine Code","Rate","Last Sold Rate"],keys:["model","code","rate","lastSold"],money:[2,3]},
 parts:{title:"Parts",subtitle:"Manage individual component names and rates.",icon:<Package/>,add:"Add Part",cols:["Part Name","Rate"],keys:["name","rate"],money:[1]},
 groupings:{title:"Grouping / Combo",subtitle:"Combine machines with their component parts.",icon:<Layers3/>,add:"Add Grouping",cols:["Machine Code","Included Parts","Combo Total"],keys:["machineCode","parts","comboTotal"],money:[2]},
 descriptions:{title:"Description",subtitle:"Create descriptions selectable for individual PI machine entries.",icon:<FileText/>,add:"Add Description",cols:["Description"],keys:["text"]}
};

function MasterPage({type,db,open,remove}){
 const cfg=masterCfg[type], rows=db[type]||[];
 const display=rows.map(r=>({...r,parts:Array.isArray(r.parts)?r.parts.map(p=>`${p.name} (${money(p.rate)})`).join(", "):r.parts}));
 return <><PageHead title={cfg.title} subtitle={cfg.subtitle} icon={cfg.icon} button={cfg.add} onClick={()=>open(type)}/><section className="card table-card"><div className="toolbar"><div className="search"><Search/><input placeholder={`Search ${cfg.title.toLowerCase()}...`}/></div><button className="secondary"><Settings size={16}/> Filters</button></div><Table rows={display} cols={[...cfg.cols,"Actions"]} keys={[...cfg.keys,"actions"]} money={cfg.money||[]} actions onEdit={r=>open(type,r)} onDelete={r=>remove(type,r.id)}/></section></>
}
function PageHead({title,subtitle,icon,button,onClick}){return <div className="page-head"><div className="title"><div className="title-icon">{icon}</div><div><h1>{title}</h1><p>{subtitle}</p></div></div>{button&&<button className="primary" onClick={onClick}><Plus/>{button}</button>}</div>}

function Table({rows,cols,keys,money=[],actions=false,onEdit,onDelete}){
 return <div className="tablewrap"><table><thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={r.id||i}>{keys.map((k,j)=><td key={k}>{k==="actions"?<div className="row-actions"><button className="icon-action" onClick={()=>onEdit?.(r)}><Pencil size={15}/></button><button className="icon-action danger-icon" onClick={()=>onDelete?.(r)}><Trash2 size={15}/></button></div>:money.includes(j)?moneyFmt(r[k]):r[k]}</td>)}</tr>):<tr><td colSpan={cols.length} className="empty">No records found.</td></tr>}</tbody></table></div>
}
function moneyFmt(v){return money(v)}

function MasterModal({state,close,save,db}){
 const t=state.type,row=state.row||{};
 const [v,setV]=useState({...row});
 const field=(key,label,type="text")=><label>{label}<input type={type} value={v[key]??""} onChange={e=>setV({...v,[key]:type==="number"?Number(e.target.value):e.target.value})}/></label>;
 const submit=()=>{
  if(t==="groupings"){
   const parts=(v.partsText||"").split(",").map(s=>s.trim()).filter(Boolean).map(name=>{const p=db.parts.find(x=>x.name.toLowerCase()===name.toLowerCase());return {name,rate:p?.rate||0}});
   save(t,state.row?.id,{machineCode:v.machineCode||"",parts,comboTotal:Number(v.comboTotal||0)});
  }else if(state.mode==="edit") save(t,state.row.id,v);
  else{
   const rows={user:{username:v.username||"",employee:v.employee||"",password:v.password||"",permissions:"View + Edit"},customer:{name:v.name||"",company:v.company||"",phone:v.phone||"",email:v.email||"",address:v.address||""},machine:{model:v.model||"",code:v.code||"",rate:Number(v.rate||0),lastSold:Number(v.lastSold||0)},part:{name:v.name||"",rate:Number(v.rate||0)},description:{text:v.text||""}};
   save(t,rows[t]);
  }
 };
  const renderFields=()=>{
    if(t==="user") return <div className="modalfields">{field("username","User Name")}{field("employee","Employee Name")}{field("password","Password","password")}<div className="permission"><b>Module Permissions</b><div className="checks"><span>✓ View</span><span>✓ Edit</span></div></div></div>;
    if(t==="customer") return <div className="modalfields">{field("name","Customer Name")}{field("company","Company Name")}{field("phone","Phone")}{field("email","Email")}{field("address","Address")}</div>;
    if(t==="machine") return <div className="modalfields">{field("model","Machine Model")}{field("code","Machine Code")}{field("rate","Rate","number")}{field("lastSold","Last Sold Rate","number")}</div>;
    if(t==="part") return <div className="modalfields">{field("name","Part Name")}{field("rate","Rate","number")}</div>;
    if(t==="groupings") return <div className="modalfields">{field("machineCode","Machine Code")}<label>Parts (comma separated)<input value={v.partsText??(Array.isArray(v.parts)?v.parts.map(x=>x.name).join(", "):"")} onChange={e=>setV({...v,partsText:e.target.value})}/></label></div>;
    return <div className="modalfields">{field("text","Description")}</div>;
  };
  return <div className="overlay"><div className="modal"><div className="modalhead"><div><h2>{state.mode==="edit"?"Edit":"Add"} {masterCfg[t].title.replace("Management","")}</h2><p>Enter the required details.</p></div><button className="icon-btn" onClick={close}><X/></button></div>
  <div className="modalbody">{renderFields()}</div>
  <div className="modalactions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={submit}><Save/> Save</button></div></div></div>
}

function PIList({db,nav,customer,piTotal,onNew,onEdit}){
 return <><PageHead title="Proforma Invoice" subtitle="Create, edit and view customer proforma invoices." icon={<FileText/>} button="Create PI" onClick={onNew}/><section className="card table-card"><div className="toolbar"><div className="search"><Search/><input placeholder="Search PI number or customer..."/></div><button className="secondary">Date</button><button className="secondary">Customer</button></div><Table rows={db.pis.map(p=>({id:p.id,no:p.no,date:p.date,customer:customer(p.customerId)?.name,total:money(piTotal(p)),status:p.status,actions:p.id}))} cols={["PI No.","Date","Customer","Total","Status","Actions"]} keys={["no","date","customer","total","status","actions"]} actions onEdit={r=>onEdit(r.id)}/></section></>
}

function PIEditor({db,piId,customer,machine,onBack,onSave}){
 const old=db.pis.find(p=>p.id===piId);
 const [p,setP]=useState(old?JSON.parse(JSON.stringify(old)):{id:Date.now(),no:`PI-2026-${String(db.pis.length+1).padStart(3,"0")}`,date:today,customerId:db.customers[0]?.id||0,items:[],status:"Draft"});
 const total=p.items.reduce((s,i)=>s+i.qty*i.rate,0);
 const add=()=>{const m=db.machines[0];setP({...p,items:[...p.items,{si:p.items.length+1,machineCode:m.code,qty:1,rate:m.rate,description:""}]})};
 const change=(idx,key,val)=>setP({...p,items:p.items.map((x,i)=>i===idx?{...x,[key]:val}:x)});
 const selectMachine=(idx,code)=>{const m=machine(code);change(idx,"machineCode",code);change(idx,"rate",m?.rate||0)};
 return <><div className="backrow"><button className="back" onClick={onBack}><ArrowLeft/> Back to PI List</button></div><PageHead title={piId?"Edit Proforma Invoice":"Create Proforma Invoice"} subtitle="Customer, machine quantity, rate and description." icon={<FileText/>}/><section className="card formcard">
 <div className="formgrid"><label>PI Number<input value={p.no} disabled/></label><label>Date<input value={p.date} onChange={e=>setP({...p,date:e.target.value})}/></label><label>Customer<select value={p.customerId} onChange={e=>setP({...p,customerId:Number(e.target.value)})}>{db.customers.map(c=><option value={c.id} key={c.id}>{c.name} · {c.company}</option>)}</select></label></div>
 <div className="sectionhead"><div><h2>Machine Entries</h2><p>Predefined rate loads automatically. User can edit the PI rate. Last sold rate is reference only and is not printable.</p></div><button className="secondary" onClick={add}><Plus/> Add Machine</button></div>
 {!p.items.length&&<div className="emptybox">No machines added. Click “Add Machine”.</div>}
 {p.items.map((it,idx)=>{const m=machine(it.machineCode);return <div className="pirow" key={idx}><div className="sin">{it.si}</div><label>Machine<select value={it.machineCode} onChange={e=>selectMachine(idx,e.target.value)}>{db.machines.map(m=><option value={m.code} key={m.id}>{m.code} · {m.model}</option>)}</select></label><label>Qty<input type="number" min="1" value={it.qty} onChange={e=>change(idx,"qty",Number(e.target.value))}/></label><label>Rate<input type="number" value={it.rate} onChange={e=>change(idx,"rate",Number(e.target.value))}/><small>Last sold: {money(m?.lastSold)}</small></label><label>Description<select value={it.description} onChange={e=>change(idx,"description",e.target.value)}><option value="">Select</option>{db.descriptions.map(d=><option key={d.id}>{d.text}</option>)}</select></label><div className="linetotal"><span>Total</span><b>{money(it.qty*it.rate)}</b></div><button className="delete-row" onClick={()=>setP({...p,items:p.items.filter((_,i)=>i!==idx).map((x,i)=>({...x,si:i+1}))})}><Trash2 size={17}/></button></div>})}
 <div className="pitotal"><span>PI Total</span><strong>{money(total)}</strong></div>
 <div className="modalactions"><button className="secondary" onClick={onBack}>Cancel</button><button className="primary" onClick={()=>onSave(p)}><Save/> Save PI</button></div>
 </section></>
}

function PIView({db,piId,customer,machine,grouping,piTotal,onBack}){
 const p=db.pis.find(x=>x.id===piId); if(!p)return null; const c=customer(p.customerId);
 return <><div className="backrow"><button className="back" onClick={onBack}><ArrowLeft/> Back</button></div><div className="page-head"><div className="title"><div className="title-icon"><Eye/></div><div><h1>{p.no}</h1><p>View-only Proforma Invoice</p></div></div><button className="secondary" onClick={()=>window.print()}><Printer/> Print</button></div><section className="card invoice"><div className="invoice-top"><div><b>PROFORMA INVOICE</b><h2>{p.no}</h2><p>{p.date}</p></div><div><b>{c?.company}</b><p>{c?.name}<br/>{c?.address}<br/>{c?.phone}</p></div></div><Table rows={p.items.map(i=>({si:i.si,machine:i.machineCode,qty:i.qty,rate:money(i.rate),total:money(i.qty*i.rate),description:i.description}))} cols={["SI No.","Machine Code","Description","Qty","Rate","Total"]} keys={["si","machine","description","qty","rate","total"]}/><div className="invoice-total"><span>Total</span><b>{money(piTotal(p))}</b></div></section></>
}

function ConversionList({db,customer,piTotal,onOpen}){
 const [date,setDate]=useState(""); const [cid,setCid]=useState("");
 const rows=db.pis.filter(p=>(!date||p.date.includes(date))&&(!cid||String(p.customerId)===cid));
 return <><PageHead title="PI Conversion" subtitle="Select a PI and convert it into detailed machine and component costing." icon={<RefreshCcw/>}/><section className="card table-card"><div className="toolbar"><input className="filter" placeholder="Date" value={date} onChange={e=>setDate(e.target.value)}/><select className="filter" value={cid} onChange={e=>setCid(e.target.value)}><option value="">All Customers</option>{db.customers.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></div><Table rows={rows.map(p=>({id:p.id,no:p.no,date:p.date,customer:customer(p.customerId)?.name,total:money(piTotal(p)),status:db.conversions.find(x=>x.piId===p.id)?.finalized?"Finalized":"Pending",actions:p.id}))} cols={["PI No.","Date","Customer","PI Total","Conversion Status","Actions"]} keys={["no","date","customer","total","status","actions"]} actions onEdit={r=>onOpen(r.id)}/></section></>
}

function ConversionEditor({db,piId,customer,machine,grouping,piTotal,existing,onBack,onSave}){
 const p=db.pis.find(x=>x.id===piId); if(!p)return null; const c=customer(p.customerId);
 const initial=existing||{piId,salePrice:piTotal(p),commissions:[],finalized:false};
 const [sale,setSale]=useState(initial.salePrice); const [comm,setComm]=useState(initial.commissions||[]); const [finalized,setFinalized]=useState(initial.finalized);
 const cost=piTotal(p), profit=sale-cost, pct=cost?(profit/cost)*100:0, commPct=comm.reduce((s,x)=>s+Number(x.pct||0),0), ownerPct=pct-commPct, ownerDollar=cost*ownerPct/100;
 const addComm=()=>setComm([...comm,{name:"",pct:0}]);
 const save=()=>onSave({piId,salePrice:Number(sale),commissions:comm,finalized});
 return <><div className="backrow"><button className="back" onClick={onBack}><ArrowLeft/> Back to Conversion List</button></div><PageHead title={`Conversion · ${p.no}`} subtitle={`${c?.company} · ${c?.name}`} icon={<RefreshCcw/>}/><div className="conversiongrid"><section className="card detailcard"><div className="sectionhead"><div><h2>Detailed Machine & Part Cost</h2><p>Parts are expanded from Machine Grouping / Combo Master.</p></div>{finalized&&<span className="finalbadge"><Lock size={14}/> Finalized</span>}</div>
 {p.items.map((it,idx)=>{const g=grouping(it.machineCode);const m=machine(it.machineCode);const parts=[{name:"Machine",rate:m?.rate||it.rate},...(g?.parts||[])];return <div className="siblock" key={idx}><div className="sihead"><b>SI-{it.si} · {m?.model||it.machineCode}</b><span>{it.qty} unit(s)</span></div><Table rows={parts.map(x=>({item:x.name,rate:money(x.rate),qty:it.qty,total:money(x.rate*it.qty)}))} cols={["Item","Rate","Qty","Total"]} keys={["item","rate","qty","total"]}/><div className="sitotal">SI-{it.si} Total <b>{money(parts.reduce((s,x)=>s+x.rate*it.qty,0))}</b></div></div>})}
 <div className="grand"><span>Total Cost / Rate</span><b>{money(cost)}</b></div><div className="conversionactions">{!finalized&&<button className="secondary" onClick={save}><Save/> Save Conversion</button>} {!finalized&&<button className="primary" onClick={()=>{setFinalized(true);onSave({piId,salePrice:Number(sale),commissions:comm,finalized:true})}}><Lock/> Finalize</button>} {finalized&&<span className="readonly"><CheckCircle2/> Read-only after finalization</span>}</div>
 </section>
 <aside className="side-stack"><section className="card calc"><h2>Overall Sale Price & Profit</h2><div className="calcrow"><span>Total Rate</span><b>{money(cost)}</b></div><div className="calcrow"><span>Overall Sale Price</span><input disabled={finalized} type="number" value={sale} onChange={e=>setSale(Number(e.target.value))}/></div><div className={"profitbox "+(profit<0?"loss":"")}><span>{profit<0?"Loss":"Profit"}</span><strong>{money(profit)}</strong><em>{pct.toFixed(2)}%</em></div><h3>Commission</h3>{comm.map((x,i)=><div className="commrow" key={i}><input disabled={finalized} value={x.name} onChange={e=>setComm(comm.map((a,n)=>n===i?{...a,name:e.target.value}:a))}/><input disabled={finalized} type="number" value={x.pct} onChange={e=>setComm(comm.map((a,n)=>n===i?{...a,pct:e.target.value}:a))}/><span>%</span></div>)}{!finalized&&<button className="link" onClick={addComm}><Plus/> Add Person</button>}<div className="ownerprofit"><span>Owner Profit</span><b>{ownerPct.toFixed(2)}% · {money(ownerDollar)}</b></div></section>
 <TargetCalculator cost={cost}/></aside></div>
}
function TargetCalculator({cost}){const [v,setV]=useState("");const n=Number(v||0),pr=n-cost,p=cost?pr/cost*100:0;return <section className="card calc"><h2><Calculator size={18}/> Customer Target Price</h2><p className="muted">What-if calculation only. It does not change the actual Sale Price.</p><input className="target" type="number" placeholder="Enter customer target price" value={v} onChange={e=>setV(e.target.value)}/>{v&&<div className="targetbox"><span>Target Profit / Loss</span><b>{money(pr)} · {p.toFixed(2)}%</b></div>}</section>}

function ReportPage({title,converted,db,customer,piTotal,onView}){
 const [date,setDate]=useState("");const [cid,setCid]=useState("");
 const rows=db.pis.filter(p=>(converted?p.status==="Converted":true)&&(!date||p.date.includes(date))&&(!cid||String(p.customerId)===cid));
 return <><PageHead title={title} subtitle="View-only report. No records can be edited from reports." icon={<BarChart3/>}/><section className="card table-card"><div className="toolbar"><input className="filter" placeholder="Date" value={date} onChange={e=>setDate(e.target.value)}/><select className="filter" value={cid} onChange={e=>setCid(e.target.value)}><option value="">All Customers</option>{db.customers.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></div><Table rows={rows.map(p=>({id:p.id,no:p.no,date:p.date,customer:customer(p.customerId)?.name,total:money(piTotal(p)),status:p.status,actions:p.id}))} cols={["PI No.","Date","Customer","Total","Status","Action"]} keys={["no","date","customer","total","status","actions"]} actions onEdit={r=>onView(r.id)}/></section></>
}

createRoot(document.getElementById("root")).render(<App/>);
