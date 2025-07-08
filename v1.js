// ==UserScript==
// @name         传智考试答题增强版
// @namespace    https://stu.ityxb.com/writePaper/*
// @version      10.1
// @description  获取题目并调用后端接口，答案直接显示在题目下方，支持M/N键隐藏/显示答案
// @author       Chao
// @match        https://stu.ityxb.com/writePaper/busywork/*
// @match        https://stu.ityxb.com/writePaper/exam/*
// @match        https://stu.ityxb.com/lookPaper/busywork/*
// @match        https://stu.ityxb.com/lookPaper/exam/*
// @connect      api.ui.news   
// @connect      *
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = "https://api.ui.news/v2/3.php";
    let answersVisible = true; // 控制答案显示状态
    let statusVisible = true;  // 控制状态显示状态

    // 状态显示窗口
    const statusDiv = document.createElement("div");
    statusDiv.style.position = "fixed";
    statusDiv.style.top = "20px";
    statusDiv.style.right = "20px";
    statusDiv.style.background = "#333";
    statusDiv.style.color = "#0f0";
    statusDiv.style.padding = "10px 15px";
    statusDiv.style.zIndex = 99999;
    statusDiv.style.fontSize = "14px";
    statusDiv.style.borderRadius = "8px";
    statusDiv.innerText = "⏳ 等待题目加载...";
    document.body.appendChild(statusDiv);

    // 键盘事件监听 - 控制答案和状态显示
    document.addEventListener('keydown', function(e) {
        // 检查是否在输入框中，如果是则不执行快捷键功能
        const inputElements = ['INPUT', 'TEXTAREA', 'SELECT'];
        if (inputElements.includes(document.activeElement?.tagName)) {
            return;
        }

        // M键 - 隐藏答案和状态
        if (e.key.toLowerCase() === 'm') {
            toggleAnswers(false);
            toggleStatus(false);
            console.log('已隐藏所有答案和状态显示');
        }
        // N键 - 显示答案和状态
        else if (e.key.toLowerCase() === 'n') {
            toggleAnswers(true);
            toggleStatus(true);
            console.log('已显示所有答案和状态显示');
        }
    });

    // 切换答案显示状态
    function toggleAnswers(visible) {
        answersVisible = visible;
        const answerDivs = document.querySelectorAll('.user-answer-display');
        answerDivs.forEach(div => {
            div.style.display = visible ? 'block' : 'none';
        });
    }

    // 切换状态显示状态
    function toggleStatus(visible) {
        statusVisible = visible;
        statusDiv.style.display = visible ? 'block' : 'none';
    }

    // 等待题目加载
    const waitInterval = setInterval(() => {
        const allQuestions = document.querySelectorAll(".question-item-box");
        if (allQuestions.length > 0) {
            clearInterval(waitInterval);
            statusDiv.innerText = `🔍 题目已加载，共计 ${allQuestions.length} 题，开始查询答案...`;
            console.log(`题目总数: ${allQuestions.length}`);
            processQuestions(allQuestions);
        }
    }, 1000);

    // 处理所有题目，调用后端获取答案并显示
    function processQuestions(allQuestions) {
        let currentIndex = 0;

        function processNext() {
            if (currentIndex >= allQuestions.length) {
                statusDiv.innerText = "✅ 所有题目答案已显示完成";
                console.log("所有题目答案已显示完成");
                return;
            }

            const questionDiv = allQuestions[currentIndex];
            const titlePre = questionDiv.querySelector(".question-title-box pre");

            if (!titlePre) {
                console.warn(`⚠️ 第 ${currentIndex + 1} 题未找到题干，跳过`);
                currentIndex++;
                setTimeout(processNext, 300);
                return;
            }

            const questionText = titlePre.innerText.trim();
            const fullText = questionText; // 这里可扩展拼接选项等

            statusDiv.innerText = `📘 正在查询第 ${currentIndex + 1} 题答案`;
            console.log(`[题目 ${currentIndex + 1}] 获取到题目文本: ${questionText}`);

            const requestData = JSON.stringify({ question: fullText });
            console.log(`[题目 ${currentIndex + 1}] 发送请求体:`, requestData);

            GM_xmlhttpRequest({
                method: "POST",
                url: API_URL,
                headers: {
                    "Content-Type": "application/json"
                },
                data: requestData,
                onload: function(response) {
                    console.log(`[题目 ${currentIndex + 1}] 后端完整响应: `, response);
                    let res = {};
                    try {
                        res = JSON.parse(response.responseText);
                    } catch (e) {
                        console.error(`[题目 ${currentIndex + 1}] 响应解析失败`, e);
                        res = { code: -1 };
                    }

                    if (res.code === 0 && res.data && res.data.trim()) {
                        const answer = res.data.trim();

                        // 显示答案
                        let answerDiv = questionDiv.querySelector('.user-answer-display');
                        if (!answerDiv) {
                            answerDiv = document.createElement('div');
                            answerDiv.className = 'user-answer-display';
                            // 调整为更柔和的深绿色
                            answerDiv.style.color = '#DDEEED';
                            answerDiv.style.marginTop = '6px';
                            answerDiv.style.fontWeight = 'bold';
                            // 应用当前答案显示状态
                            answerDiv.style.display = answersVisible ? 'block' : 'none';
                            questionDiv.appendChild(answerDiv);
                        }
                        answerDiv.textContent = `答案参考：${answer}`;

                        console.log(`✅ 第 ${currentIndex + 1} 题答案显示完成: ${answer}`);
                        statusDiv.innerText = `✅ 第 ${currentIndex + 1} 题答案显示完成`;
                    } else {
                        console.warn(`❓ 第 ${currentIndex + 1} 题未找到答案，题目为: "${questionText}"，后端返回:`, res);
                        statusDiv.innerText = `⚠️ 未找到第 ${currentIndex + 1} 题答案`;
                    }

                    currentIndex++;
                    setTimeout(processNext, 500);
                },
                onerror: function(err) {
                    console.error(`[题目 ${currentIndex + 1}] 请求出错:`, err);
                    statusDiv.innerText = `❌ 请求错误，第 ${currentIndex + 1} 题`;
                    currentIndex++;
                    setTimeout(processNext, 1000);
                }
            });
        }

        processNext();
    }

})();
