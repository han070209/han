const faces = [
    "face1.png",
    "face2.png",
    "face3.png",
    "face4.png",
    "face5.png",
    "face6.png",
    "face7.png",
    "face8.png",
    "face9.png",
    "face10.png"
];

const mainFace = document.getElementById("main-face");
const message = document.getElementById("message");
const miniContainer = document.getElementById("mini-face-container");
const scoreText = document.getElementById("score");

let score = 0;
let playing = false;
let movements = [];
let speedUp;

// 메인 얼굴 클릭
mainFace.addEventListener("click", () => {

    if (playing) return;

    // 표정 변경
    const random = Math.floor(Math.random() * faces.length);
    mainFace.src = faces[random];

    // 5% 확률
    if (Math.random() < 0.05) {

        playing = true;

        message.textContent = "🚨 얼굴 폭발! 전부 잡아!";

        spawnMiniFaces();

    } else {

        message.textContent = "🙂 표정 변경!";
    }
});


// 미니 얼굴 생성
function spawnMiniFaces() {

    miniContainer.innerHTML = "";

    const count = Math.floor(Math.random() * 3) + 5;


    for (let i = 0; i < count; i++) {

        const mini = document.createElement("img");

        mini.src = faces[
            Math.floor(Math.random() * faces.length)
        ];

        mini.className = "mini-face";


        // 시작 위치
        let x = 200;
        let y = 200;

        mini.style.left = x + "px";
        mini.style.top = y + "px";

        miniContainer.appendChild(mini);


        // 팝콘처럼 퍼지는 방향
        let angle = Math.random() * Math.PI * 2;

        let dx = Math.cos(angle) * 3;
        let dy = Math.sin(angle) * 3;


        const move = setInterval(() => {

            x += dx;
            y += dy;


            // 벽 충돌
            if (x <= 0 || x >= 430) {
                dx *= -1;
            }

            if (y <= 0 || y >= 430) {
                dy *= -1;
            }


            mini.style.left = x + "px";
            mini.style.top = y + "px";

        }, 16);


        movements.push({
            interval: move,
            velocity: { dx, dy }
        });


        // 클릭
        mini.addEventListener("click", () => {

            clearInterval(move);

            mini.style.transform = "scale(1.8)";
            mini.style.opacity = "0";

            setTimeout(() => {

                mini.remove();

                score++;
                scoreText.textContent = score;


                if (miniContainer.children.length === 0) {
                    endGame(true);
                }

            }, 120);

        });

    }


    // 점점 빨라짐
    speedUp = setInterval(() => {

        movements.forEach(obj => {

            obj.velocity.dx *= 1.1;
            obj.velocity.dy *= 1.1;

        });

    }, 1000);


    // 4초 제한
    setTimeout(() => {

        if (playing) {
            endGame(false);
        }

    }, 4000);
}


// 게임 종료
function endGame(success) {

    playing = false;

    movements.forEach(obj => {
        clearInterval(obj.interval);
    });

    movements = [];

    clearInterval(speedUp);


    if (!success) {
        miniContainer.innerHTML = "";
        message.textContent = "💀 놓쳤다!";
    }
    else {
        message.textContent = "🔥 완벽하게 잡았다!";
    }
}
