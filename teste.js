
const hoje = new Date();
hoje.setUTCDate(-1)
console.log(hoje.toISOString().replace(/-/g, '_').slice(0, 10));
// const month = hoje.toLocaleString('default', { month: 'long' });
// console.log(month);