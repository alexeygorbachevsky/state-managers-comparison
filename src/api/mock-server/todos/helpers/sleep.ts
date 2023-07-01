const sleep = (time = 2000) => new Promise(res => setTimeout(res, time));

export default sleep;
