let filesArr = [];
const dropArea = document.querySelector(".drop-area");

dropArea.addEventListener("dragenter", (e) => {
  e.preventDefault();
  dropArea.classList.add("drop-area-over");
});

dropArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropArea.classList.remove("drop-area-over");
});

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("drop-area-over");
  const transferredFiles = e.dataTransfer.files;
  handleFiles(transferredFiles);
});

document.querySelector("#file-input").addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('filesArr', JSON.stringify(filesArr));
});

function loadFilesOnReload() {
  const storedFilesArr = JSON.parse(localStorage.getItem('filesArr')) || [];
  storedFilesArr.forEach((fileName) => {
    const item = JSON.parse(localStorage.getItem(fileName));
    filesArr.push(fileName);
    insertHTML(fileName, item.size);
  });
}

loadFilesOnReload();

function handleFiles(files) {
  [...files].forEach((transferredFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(transferredFile);

    reader.addEventListener("error", () => {
      console.error(`Произошла ошибка при чтении файла: ${transferredFile.name}`);
      return;
    });

    reader.addEventListener("load", (e) => {
      insertHTML(transferredFile.name, transferredFile.size);
      localStorage.setItem(transferredFile.name, JSON.stringify({ result: e.target.result, size: transferredFile.size }));
      let ix = transferredFile.name.lastIndexOf('.');
      filesArr.push(transferredFile.name);
      document.querySelector('#selectType').innerHTML += `<option value="${transferredFile.name.slice(ix)}">${transferredFile.name.slice(ix)}</option>`;
      setOptions();
    });
  });
}

function insertHTML(name, size) {
  dropArea.insertAdjacentHTML(
    "beforeend",
    `<div class="drop-area-preview">
        <div class="drop-area-name">
          File name: ${name}</br>
          File size: ${(size / 1024).toFixed(2)}KB
        </div>
        <div id="${name.match(/[a-zA-Z0-9]/g).join('')}" class="drop-area-remove">
          <svg viewBox="0 0 24 24" height="24" width="24">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path fill='#f5f5f5' d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </div>
        <button id="${name.match(/[a-zA-Z0-9]/g).join('')}2">Открыть файл</button>
      </div>`
  );

  document.querySelector(`#${name.match(/[a-zA-Z0-9]/g).join('')}`).addEventListener('click', (e) => {
    e.target.closest(".drop-area-preview").remove();
    localStorage.removeItem(name);
    let ix = name.lastIndexOf('.');
    document.querySelector(`#${name.slice(ix + 1)}`).remove();
    filesArr = filesArr.filter(e => e !== name);
    setOptions();
  });

  document.querySelector(`#${name.match(/[a-zA-Z0-9]/g).join('')}2`).addEventListener('click', (e) => {
    let item = localStorage.getItem(name);
    let file = JSON.parse(item).result;
    let window2 = window.open();
    window2.document.write('<iframe src="' + file + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  });
}

document.body.insertAdjacentHTML('afterbegin',
  `<select name="s" id="selectType">
    <option value="All">All</option>
  </select>
  <input type="number" id="filterSize">
  `
);

function renderFiles() {
  for (let i = 0; i < localStorage.length; i++) {
    let name = localStorage.key(i);
    filesArr.push(name);
    let item = JSON.parse(localStorage.getItem(name));
    insertHTML(name, item.size);
  }
}

renderFiles();
setOptions();

document.querySelector('#selectType').addEventListener('change', (e) => {
  let type = e.target.value;
  document.querySelector('.drop-area').innerHTML = '';
  if (type == 'All') {
    for (let i = 0; i < localStorage.length; i++) {
      let name = localStorage.key(i);
      let item = JSON.parse(localStorage.getItem(name));
      insertHTML(name, item.size);
    }
    return;
  }
  let newArr = filesArr.filter(e => e.includes(type));
  newArr.forEach(e => {
    let item = JSON.parse(localStorage.getItem(e));
    insertHTML(e, item.size);
  });
});

document.querySelector('#filterSize').addEventListener('change', e => {
  let newArr = [];
  document.querySelector('.drop-area').innerHTML = '';
  if (e.target.value !== '') {
    for (let i = 0; i < localStorage.length; i++) {
      let name = localStorage.key(i);
      let item = JSON.parse(localStorage.getItem(name));
      if (item.size / 1024 >= e.target.value) {
        newArr.push(name);
      }
    }
    newArr.forEach(e => {
      let item = JSON.parse(localStorage.getItem(e));
      insertHTML(e, item.size);
    });
  } else {
    renderFiles();
  }
});

function setOptions() {
  document.querySelector('#selectType').innerHTML = '<option value="All">All</option>';
  let types = [];
  for (let i = 0; i < localStorage.length; i++) {
    let name = localStorage.key(i);
    let ix = name.lastIndexOf('.');
    if (types.includes(name.slice(ix).match(/[a-zA-Z0-9]/g).join(''))) {
      continue;
    }
    types.push(name.slice(ix).match(/[a-zA-Z0-9]/g).join(''));
    document.querySelector('#selectType').innerHTML += `<option id="${name.slice(ix).match(/[a-zA-Z0-9]/g).join('')}" value="${name.slice(ix)}">${name.slice(ix)}</option>`;
  }
}
