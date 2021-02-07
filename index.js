const panelEle = document.querySelector(".panel");
const chooseStickerBtn = document.querySelector(".chooseSticker");
const stickersEle = document.querySelector(".stickers");
const msgInputEle = document.querySelector(".messageInput");
const sendBtn = document.querySelector(".send");

const stickers = {
    pikachu: {
        path: './pikachu.json'
    },
    bomb: {
        path: "./4493-bomb.json",
    },
    kiss: {
        path: './28106-kiss-emoji.json'
    },
    happy: {
        path: './41-emoji-tongue.json'
    }
};

Object.keys(stickers).forEach(key => {
    const lottieEle = stickersEle.appendChild(document.createElement('span'))
    // 为每个表情创建 lottie 实例
    const player = lottie.loadAnimation({
        container: lottieEle,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: stickers[key].path  // ae json
    })

    lottieEle.addEventListener('click', () => {
        appendMsg(key, 'sticker')
    })
    lottieEle.addEventListener("touchmove", () => {
        player.play();
    });
    lottieEle.addEventListener("touchend", () => {
        player.stop();
    });
})

chooseStickerBtn.addEventListener("click", () => {
    stickersEle.classList.toggle("show");
});

panelEle.addEventListener('click', function () {
    try {
        stickersEle.classList.remove('show');
    } catch (e) { }
})

sendBtn.addEventListener("click", () => {
    const msg = msgInputEle.value;
    if (msg) {
        appendMsg(msg);
    }
});

function appendMsg(msg, type) {
    // 创建消息元素
    const msgEle = panelEle.appendChild(document.createElement("div"));
    msgEle.classList.add("message", "mine"); // 设置为“我“发送的样式
    msgEle.innerHTML = `
      <img class="avatar" src="./me.jpg" alt="" />
      <p><span>${msg}</span></p>
    `;
    if (type === 'sticker') {
        msgEle.innerHTML = `
      <img class="avatar" src="./me.jpg" alt="" />
      <p><span></span></p>
    `;
        playSticker(msg, msgEle);
    }
    // 滚动到最新消息
    panelEle.scrollTop = panelEle.scrollHeight;
    msgInputEle.value = "";
}

function playSticker(key, msgEle, automatic
) {
    const lottieEle = msgEle.querySelector('span')
    lottieEle.style.width = "60px";
    lottieEle.style.height = "60px";
    const instance = lottie.loadAnimation({
        container: lottieEle,
        renderer: 'canvas',
        loop: 'false',
        autoplay: true,
        path: stickers[key].path
    })



    if (key === 'bomb') {
        instance.addEventListener('complete', function () {
            setTimeout(function () {
                // 💥效果
                playExplosion(msgEle, lottieEle.parentNode.parentNode, automatic);
                // 窗口抖动
                shakeMessages();
            }, 300)
        })


    }
}

// 爆炸效果
function playExplosion(anchor, Pnode, automatic) {
    // 轰炸区
    const avatar = Pnode.querySelector('.avatar')
    const bubble = Pnode.querySelector('p')
    let left = false;
    // 调整轰炸区x轴
    if (avatar.src.includes('you')) {
        left = true
    }
    const explosionAnimeEle = anchor.appendChild(document.createElement("div"));
    explosionAnimeEle.style.position = 'absolute'
    explosionAnimeEle.style.width = "230px";
    explosionAnimeEle.style.height = "115px";
    if (left) {
        explosionAnimeEle.style.left = '-40px';
    } else {
        explosionAnimeEle.style.right = '-40px';
    }
    explosionAnimeEle.style.bottom = '-18px';

    const explosionPlayer = lottie.loadAnimation({
        container: explosionAnimeEle,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./9990-explosion.json",
    });

    bubble.style.display = 'none'
    avatar.style.display = 'none'
    explosionPlayer.setSpeed(.3)
    setTimeout(function () {
        // 恢复显示
        bubble.style.display = 'flex'
        avatar.style.display = 'block'
    }, 600)
    explosionPlayer.addEventListener('complete', () => {
        explosionPlayer.destroy()
        explosionAnimeEle.remove();
        if (automatic) {
            const msgEle = panelEle.appendChild(document.createElement("div"));
            msgEle.classList.add("message", "yours");
            setTimeout(function () {
                msgEle.innerHTML = `
            <img class="avatar" src="./you.jpg" alt="" />
            <p><span>新年快乐啦，祝你越来越可爱，健康又美丽，牛年钱超多，牛年冲冲冲</span></p>
            `;
            }, 300)
        }
    })
}

// 窗口抖动
function shakeMessages() {
    [...panelEle.children]
        .reverse()
        .slice(0, 5)
        .forEach((message) => {
            const avatarEle = message.querySelector("img");
            const msgContentEle = message.querySelector("p");
            avatarEle.classList.remove("shake");
            msgContentEle.classList.remove("shake");
            setTimeout(() => {
                avatarEle.classList.add("shake");
                msgContentEle.classList.add("shake");
            }, 700);
        })
}


// 自动聊天
function automaticallyChat() {
    const chats = ['呼叫小鸭子', '我来给你表演个十级特效', 'bomb']
    chats.forEach((chat, index) => {
        setTimeout(function () {
            const msgEle = panelEle.appendChild(document.createElement("div"));
            msgEle.classList.add("message", "yours");
            msgEle.innerHTML = `
            <img class="avatar" src="./you.jpg" alt="" />
            <p><span>${chat}</span></p>
            `;
            if (chat === 'bomb') {
                msgEle.innerHTML = `
                <img class="avatar" src="./you.jpg" alt="" />
                <p><span></span></p>
              `;
                playSticker(chat, msgEle, true);
            }
        }, (index + 1) * 1000)
    })
}

automaticallyChat()