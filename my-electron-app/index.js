
const imageTag = document.getElementById('imageTag');
// const time = document.getElementById('time');

window.electronAPI.getImage((event, data) => {
    imageTag.src = data;
    window.electronAPI.closeWindow2();
})

let startTime = 0;

const screenData = [];

window.electronAPI.getTitle((event, windowTitle) => {
    const titleElement = document.getElementById('window-title');
    if (titleElement.innerText !== windowTitle) {
        const elapsedTime = titleElement.innerText === '' ? 0 : Date.now() - startTime
        screenData.push({ [titleElement.innerText]: `${Math.floor(elapsedTime / 1000)} seconds` })
        startTime = Date.now();
    }
    titleElement.innerText = windowTitle;

    console.log(screenData);
})

// window.electronAPI.getTime((event, windowTime) => {
//     const timeElement = document.getElementById('window-time');
//     timeElement.innerText = windowTime;
// })