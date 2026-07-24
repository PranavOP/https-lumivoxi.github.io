
const nums=document.querySelectorAll('.num');
const obs=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting){
const el=e.target,target=+el.dataset.target;
let c=0,step=Math.max(1,Math.ceil(target/80));
const i=setInterval(()=>{
c+=step;
if(c>=target){c=target;clearInterval(i);}
el.textContent=c;
},20);
obs.unobserve(el);
}
});
});
nums.forEach(n=>obs.observe(n));
