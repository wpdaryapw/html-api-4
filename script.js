function dropHandler(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
  }
  
  function dragOverHandler(event) {
    event.preventDefault();
  }
  
  function handleFiles(files) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
  
    for (const file of files) {
      const fileItem = document.createElement('div');
      fileItem.classList.add('file-item');
  
      const fileName = document.createElement('p');
      fileName.textContent = `Name: ${file.name}`;
  
      const fileType = document.createElement('p');
      fileType.textContent = `Type: ${file.type || 'N/A'}`;
  
      const fileSize = document.createElement('p');
      fileSize.textContent = `Size: ${formatSize(file.size)}`;
  
      const fileLink = document.createElement('a');
      fileLink.textContent = 'Просмотреть';
      fileLink.href = URL.createObjectURL(file);
      fileLink.target = '_blank';
  
      fileItem.appendChild(fileName);
      fileItem.appendChild(fileType);
      fileItem.appendChild(fileSize);
      fileItem.appendChild(fileLink);
  
      fileList.appendChild(fileItem);
    }
  
    saveFilesToLocalStorage(files);
  }
  
  function formatSize(bytes) {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return kb.toFixed(2) + ' KB';
    } else {
      return (kb / 1024).toFixed(2) + ' MB';
    }
  }
  
  function saveFilesToLocalStorage(files) {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles')) || [];
    for (const file of files) {
      storedFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
    localStorage.setItem('storedFiles', JSON.stringify(storedFiles));
  }
  
  function resetFiles() {
    localStorage.removeItem('storedFiles');
    document.getElementById('file-list').innerHTML = '';
  }
  
  function downloadFiles() {
    const storedFiles = JSON.parse(localStorage.getItem('storedFiles')) || [];
  
    if (storedFiles.length === 0) {
      alert('Нет файлов для скачивания.');
      return;
    }
  }
  