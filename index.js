const axios = require('axios');
const sleep = async time => new Promise(res => setTimeout(res, time * 1000));

async function throttleRPS(func_arr, rps) {
    const pool = [];
    let i = 0;

    for (const func of func_arr) {
        pool.push(func());
        if (++i % rps === 0) {
            await sleep(1);
        }
    }

    return Promise.all(pool);
}

(async () => {
    const works = [];
    for (let i = 0; i < 100; i++) {
        works.push(async () => {
            console.log(i);
            // 여기서에 sleep 은 request 를 의미한다고 가정하며, 그 리턴값은 i 라고 가정.
            await sleep(1);
            return i
        });
    }

    // 어떠한 API 를 연동할때 RPS(Requests Per Second) 가 10이상일 경우
    // 10개의 요청을 보내고 1초 후 또 10개의 요청을 보낼 수 있도록 조절한다.
    const data = await throttleRPS(works, 10);

    console.log(data);
})();
