

let dockerTerminal;
// let kubernetesTerminal;
let dockerCommandHistory = [];
let lastCommand = '';
let activeDashboard = 'docker';
let yamlContent = '';
let showWarning = true;
let imageNameInputFocus = document.getElementById('imageNameInput');
let containerNameInputFocus = document.getElementById('containerNameInput');
let containerIdInputFocus = document.getElementById('containerIdInput');
let filePathInput = document.getElementById('dockerComposeFileInput');
let argsIdFocus = document.getElementById('arguments');
let userNameFocus = document.getElementById('userName');
let passwordFocus = document.getElementById('password');
let customDockerCommandFocus = document.getElementById('customDockerCommand')








document.addEventListener('DOMContentLoaded', function() {

  initializeDockerTerminal();
  initializeKubernetesTerminal();
  toggleDashboard('docker');

  document.getElementById('dockerDashboardButton').addEventListener('click', function() {
    toggleDashboard('docker');
  });

  document.getElementById('kubernetesDashboardButton').addEventListener('click', function() {
    toggleDashboard('kubernetes');
  });


// document.getElementById('jenkinsDashboardButton').addEventListener('click', function() {
//   toggleDashboard('jenkins');
// });


  document.getElementById('showHistoryButton').addEventListener('click', showHistory);
  document.getElementById('dockerRunButton').addEventListener('click', runDockerRun);
  document.getElementById('closeErrorDialog').addEventListener('click', function() {
    document.getElementById('errorDialog').style.display = 'none';
  });

  document.getElementById('portMappingCheckbox').addEventListener('click',function() {
    toggleMappingInput('port');
  });

  document.getElementById('volumeMappingCheckbox').addEventListener('click',function() {
    toggleMappingInput('volume');
  });


  document.getElementById('confirmDownButton').addEventListener('click', confirmDownCommand);
  document.querySelectorAll('.close,.cancel').forEach(function(closeButton) {
    closeButton.addEventListener('click', function() {
      closeModal(closeButton.closest('.modal'));
    });
  });

document.getElementById('cancel').addEventListener('click', confirmDownModal )

function confirmDownModal(){
  document.getElementById('confirmationModal').style.display ='none'
}

  document.getElementById('dockerPsButton').addEventListener('click', function() {
    runDockerCommand('docker ps');
  });

  document.getElementById('dockerRmButton').addEventListener('click', runDockerRmCommand);
  document.getElementById('dockerStartButton').addEventListener('click', runDockerStartCommand);
  document.getElementById('dockerInspectButton').addEventListener('click', runDockerInspectCommand);
  document.getElementById('dockerPauseButton').addEventListener('click', runDockerPauseCommand);
  document.getElementById('dockerUnpauseButton').addEventListener('click', runDockerUnpauseCommand);
  document.getElementById('dockerLoginBtn').addEventListener('click', runDockerLoginCommand);
  
  document.getElementById('dockerImagesButton').addEventListener('click', function() {
    runDockerCommand('docker images');
  });

  document.getElementById('clearDockerTerminalButton').addEventListener('click', function() {
    clearTerminal(dockerTerminal);
  });

  document.getElementById('dockerPsAButton').addEventListener('click', function() {
    runDockerCommand('docker ps -a');
  });
  document.getElementById('dockerInfoButton').addEventListener('click', function() {
    runDockerCommand('docker info');
  });

  document.getElementById('dockerLogoutBtn').addEventListener('click', function() {
    runDockerCommand('docker logout');
  });

  document.getElementById('dockerStopButton').addEventListener('click', runDockerStopCommand);
  document.getElementById('dockerRmiButton').addEventListener('click', runDockerRmiCommand);
  document.getElementById('dockerPullButton').addEventListener('click', runDockerPullCommand);








// Initialize CodeMirror for the Docker Compose editor
const composeEditor = CodeMirror(document.getElementById('composeEditor'), {
  lineNumbers: true,
  mode: 'yaml',
  theme: 'material'
});

// Set up event listeners
document.getElementById('createComposeFileBtn').addEventListener('click', function() {
  const modal = document.getElementById('composeModal');
  const defaultComposeContent = `
version: '3'
services:
web:
  image: nginx:latest
  ports:
    - "80:80"
db:
  image: postgres:latest
  environment:
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
`;
modal.style.display = 'block';

  composeEditor.setValue(defaultComposeContent.trim());
  
});

document.getElementById('saveComposeBtn').addEventListener('click', function() {
  const content = composeEditor.getValue(); // Use CodeMirror's getValue method
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'docker-compose.yml';
  a.click();
  URL.revokeObjectURL(a.href);
});

// document.getElementById('uploadComposeBtn').addEventListener('click', function() {
//   const fileInput = document.getElementById('dockerComposeFileUpload');
//   fileInput.click();
 
// });

document.getElementById('dockerComposeFileUpload').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const contents = e.target.result;
      composeEditor.setValue(contents);
    };
    reader.readAsText(file);
  }
  // clearFileInput();
});
  
  







  
  
  
  
  // input clear function after command execution
  
  function clearFileInput() {
    const fileInput = document.getElementById('dockerComposeFileUpload');
    const uploadedFileName = document.getElementById('uploadedFileName');
    fileInput.value = '';
    uploadedFileName.textContent = 'no file chosen';
    uploadedFileName.style.color = "white";
    console.log("File input cleared");
    filePathInput.value = '';
}



function clearImageInput(){
  const clearImageInput = document.getElementById('imageNameInput');
  clearImageInput.value ='';
}

function clearContainerNameInput(){
  const clearContainerNameInput = document.getElementById('containerNameInput');
  clearContainerNameInput.value ='';
}

function clearContainerIdInput(){
  const clearContainerIdInput = document.getElementById('containerIdInput');
  clearContainerIdInput.value ='';
}






//   document.getElementById('saveComposeBtn').addEventListener('click', saveComposeFile);
  // document.getElementById('uploadComposeBtn').addEventListener('click', uploadComposeFile);
  document.getElementById('dockerComposeUpButton').addEventListener('click', function() {
    
    runDockerComposeCommand('up');
    
  });

  document.getElementById('dockerComposeDownButton').addEventListener('click', function() {
    if (showWarning) {
      const modal = document.getElementById('confirmationModal');
      modal.style.display = 'block';
    } else {
      runDockerComposeCommand('down');
    }
  });

  document.getElementById('dockerComposeLogsButton').addEventListener('click', function() {
    runDockerComposeCommand('logs');
  });

  document.getElementById('dockerComposePsButton').addEventListener('click', function() {
    runDockerComposeCommand('ps');
  });

  document.getElementById('dockerComposeBuildButton').addEventListener('click', function() {
    runDockerComposeCommand('build');
  });

  // document.getElementById('dockerComposeRunButton').addEventListener('click', function() {
  //   // runDockerComposeCommand('run');
  // });

  document.getElementById('dockerComposeRunButton').addEventListener('click',runDockerComposeRunCommand);

  document.getElementById('dockerComposeStartButton').addEventListener('click', function() {
    runDockerComposeCommand('start');
  });

  document.getElementById('dockerComposeStopButton').addEventListener('click', function() {
    runDockerComposeCommand('stop');
  });

  document.getElementById('dockerComposeCreateButton').addEventListener('click', function() {
    runDockerComposeCommand('create');
  });

  document.getElementById('dockerComposePauseButton').addEventListener('click', function() {
    runDockerComposeCommand('pause');
  });

  document.getElementById('dockerComposeUnpauseButton').addEventListener('click', function() {
    runDockerComposeCommand('unpause');
  });


  document.getElementById('dockerComposeFileUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      // const filePathInput = document.getElementById('dockerComposeFileInput');
      // let filePathInput = document.getElementById('dockerComposeFileInput');
      const uploadedFileName = document.getElementById('uploadedFileName');
      filePathInput.value = file.path;
      uploadedFileName.textContent = `File uploaded: ${file.name}`;
      uploadedFileName.style.color = "#FF7F11"; // optional: change the text color to orange
    }
    document.getElementById('clearSelection').style.display = 'flex';
  });

document.getElementById('clearSelection').addEventListener('click', clearFileInput)







  
  function initializeDockerTerminal() {
    dockerTerminal = new Terminal({
      fontSize: 12.5,
      theme: {
        background: '#FFE4E1',
        foreground: '#000000',
        cursor: '#ffffff',
        color: `#000000`
      },
      windowOptions: {
        title: 'Terminal',
        transparent: true
      }
      });
   


    dockerTerminal.open(document.getElementById('dockerTerminalContainer'));
  

  }
  








  function toggleDashboard(dashboard) {
    const dockerDashboard = document.getElementById('dockerDashboard');
    const kubernetesDashboard = document.getElementById('kubernetesDashboard');
    const dockerButton = document.getElementById('dockerDashboardButton');
    const kubernetesButton = document.getElementById('kubernetesDashboardButton');
// const jenkinsDashboard = document.getElementById('jenkinsDashboard');
// const jenkinsButton = document.getElementById('jenkinsDashboardButton')


    if (dashboard === 'docker') {
      dockerDashboard.style.display = 'block';
      kubernetesDashboard.style.display = 'none';
      // jenkinsDashboard.style.display = 'none';
      dockerButton.classList.add('active-dashboard');
      kubernetesButton.classList.remove('active-dashboard');
      // jenkinsButton.classList.remove('active-dashboard');


      if (!dockerTerminal) {
        initializeDockerTerminal();
      }
    } else if (dashboard === 'kubernetes') {
      dockerDashboard.style.display = 'none';
      kubernetesDashboard.style.display = 'block';
      // jenkinsDashboard.style.display = 'none';
      dockerButton.classList.remove('active-dashboard');
      kubernetesButton.classList.add('active-dashboard');
      // jenkinsButton.classList.remove('active-dashboard');

      if (!kubernetesTerminal) {
        initializeKubernetesTerminal();
      }
    } 
    // else if (dashboard === 'jenkins') {
    //   dockerDashboard.style.display = 'none';
    //   kubernetesDashboard.style.display = 'none';
    //   jenkinsDashboard.style.display = 'block';
    //   dockerButton.classList.remove('active-dashboard');
    //   kubernetesButton.classList.remove('active-dashboard');
    //   jenkinsButton.classList.add('active-dashboard');

     
    // }
  }



  function addCommandToHistory(command, dashboard) {
    const timestamp = new Date().toLocaleString();
    if (dashboard === 'docker') {
        dockerCommandHistory.push({ command, timestamp });
    } 
    lastCommand = command; // Save the latest command
}





  function showHistory() {
    const modal = document.getElementById('historyModal');
    const historyDiv = document.getElementById('commandHistory');
    const activeDashboard = document.getElementById('dockerDashboard').style.display === 'block' ? 'docker' : 'kubernetes';
    historyDiv.innerHTML = '';

    let historyToDisplay = activeDashboard === 'docker' ? dockerCommandHistory : kubernetesCommandHistory;

    historyToDisplay.forEach(entry => {
        const [date, time] = entry.timestamp.split(', ');

        const entryDiv = document.createElement('div');
        entryDiv.className = 'history-entry';

        const dateSpan = document.createElement('span');
        dateSpan.className = 'date';
        dateSpan.textContent = date;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'time';
        timeSpan.textContent = time;

        const commandSpan = document.createElement('span');
        commandSpan.className = 'command';
        commandSpan.textContent = entry.command;

        entryDiv.appendChild(dateSpan);
        entryDiv.appendChild(timeSpan);
        entryDiv.appendChild(commandSpan);

        historyDiv.appendChild(entryDiv);
    });

    modal.style.display = 'block';
}

// function closeHistory() {
//     const modal = document.getElementById('historyModal');
//     modal.style.display = 'none';
// }

window.onclick = function(event) {
    const modal = document.getElementById('historyModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}



function toggleMappingInput(type) {
    const mappingInputDiv = document.getElementById('mappingInput');
    const volumeMappingInputDiv = document.getElementById('volumeMappingInput')

    if (type === 'port') {
      const portInputExists = document.getElementById('portInput');
      if (document.getElementById('portMappingCheckbox').checked && !portInputExists) {
        const portInput = document.createElement('input');
        portInput.type = 'text';
        portInput.id = 'portInput';
        portInput.placeholder = 'Enter port mapping (e.g., 8080:80)';
        mappingInputDiv.appendChild(portInput);
      } else if (!document.getElementById('portMappingCheckbox').checked && portInputExists) {
        mappingInputDiv.removeChild(portInputExists);
      }
    } else if (type === 'volume') {
      const volumeInputExists = document.getElementById('volumeInput');
      if (document.getElementById('volumeMappingCheckbox').checked && !volumeInputExists) {
        const volumeInput = document.createElement('input');
        volumeInput.type = 'text';
        volumeInput.id = 'volumeInput';
        volumeInput.placeholder = 'Enter volume mapping (e.g., /host/path:/container/path)';
        // mappingInputDiv.appendChild(volumeInput);
        volumeMappingInputDiv.appendChild(volumeInput);
      } else if (!document.getElementById('volumeMappingCheckbox').checked && volumeInputExists) {
        // mappingInputDiv.removeChild(volumeInputExists);
        volumeMappingInputDiv.removeChild(volumeInputExists);
      }
    }
  }





  function validatePortMapping(portMapping) {
    const regex = /^[0-9]+:[0-9]+$/;
    return regex.test(portMapping);
}

  function validateVolumeMapping(volumeMapping) {
    const regex = /^\/[^:]+:[^:]+$/;
    return regex.test(volumeMapping);
}



  function displayErrorDialog(message) {
    const errorDialog = document.getElementById('errorDialog');
    const errorMessage = document.getElementById('errorMessage');
  
    errorMessage.textContent = message;
    errorDialog.style.display = 'flex';
  
    // dialog closing if clicked anywhere inside dom
    errorDialog.addEventListener('click', function(event) {
      if (event.target === errorDialog) {
        closeErrorDialog();
      }
    });
  
    // Close the dialog when clicking the close button
    document.getElementById('closeErrorDialog').addEventListener('click', closeErrorDialog);
  
    
    // Function to close the error dialog
    function closeErrorDialog() {
      errorDialog.style.display = 'none';
    }
  }

 


function runDockerRun() {
    const imageName = document.getElementById('imageNameInput').value.trim();
    const containerName = document.getElementById('containerNameInput').value.trim();
    const portMapping = document.getElementById('portInput')?.value.trim();
    const volumeMapping = document.getElementById('volumeInput')?.value.trim();
    const errorMessageDiv = document.getElementById('errorMessage');


    if (!imageName) {

      imageNameInputFocus.focus()
  return;
}

    if (!containerName) {
  
  containerNameInputFocus.focus();
  return;
}

    // let command = `docker run --name ${containerName}`;
    let command = `docker run --name ${imageName}`;

    if (portMapping) {
  if (!validatePortMapping(portMapping)) {
    displayErrorDialog('Invalid port mapping format. Please use format hostPort:containerPort.');
    return;
  }
  command += ` -p ${portMapping}`;
}

if (volumeMapping) {
  if (!validateVolumeMapping(volumeMapping)) {
    displayErrorDialog('Invalid volume mapping format. Please use format /host/path:/container/path.');
    return;
  }
  command += ` -v ${volumeMapping}`;
}

    command += ` ${containerName}`;
    errorMessageDiv.textContent = ''; // Clear any previous error messages
    console.log(`Running command: ${command}`);

    runDockerCommand(command)

    // addCommandToHistory(command, 'docker');
    showNotification();
    clearImageInput()
    clearContainerNameInput()
    
  }



  // function showErrorDialog(message) {
  //   const dialog = document.getElementById('errorDialog');
  //   document.getElementById('errorMessage').textContent = message;
  //   dialog.style.display = 'block';
  // }

  function confirmDownCommand() {
    if (document.getElementById('dontShowWarning').checked) {
      showWarning = false;
    }
    runDockerComposeCommand('down');
    closeModal(document.getElementById('confirmationModal'));
  }

  function closeModal(modal) {
    modal.style.display = 'none';
  }

  function runDockerCommand(command) {
    // dockerCommandHistory.push(command);
    dockerTerminal.write(`Running command: ${command}\r\n`);
    window.electronAPI.runCommand(command, 'docker');
    addCommandToHistory(command, 'docker');
  }

  function runDockerRmCommand() {
    const containerId = document.getElementById('containerIdInput').value;
    if (!containerId) {
      // displayErrorDialog('Please enter a Container ID.');
      containerIdInputFocus.focus()
      return;
    }
    runDockerCommand(`docker rm ${containerId}`);
    clearContainerIdInput()
  }
  
  function runDockerStartCommand(){
    const containerId = document.getElementById('containerIdInput').value;
    if (!containerId) {
      // displayErrorDialog('Please enter a Container ID.');
      containerIdInputFocus.focus()
      return;
    }
    runDockerCommand(`docker start ${containerId}`);
    clearContainerIdInput()
    
  }
  
  function runDockerInspectCommand(){
    const containerId = document.getElementById('containerIdInput').value;
    if (!containerId) {
      // displayErrorDialog('Please enter a Container ID.');
      containerIdInputFocus.focus()
      return;
    }
    runDockerCommand(`docker inspect ${containerId}`);
    clearContainerIdInput()
    
  }

  function runDockerPauseCommand(){
    const containerId = document.getElementById('containerIdInput').value;
    if (!containerId) {
      // displayErrorDialog('Please enter a Container ID.');
      containerIdInputFocus.focus()
      return;
    }
    runDockerCommand(`docker pause ${containerId}`);
    clearContainerIdInput()
    
  }


  function runDockerUnpauseCommand(){
    const containerId = document.getElementById('containerIdInput').value;
    if (!containerId) {
      // displayErrorDialog('Please enter a Container ID.');
      containerIdInputFocus.focus()
      return;
    }
    runDockerCommand(`docker unpause ${containerId}`);
    clearContainerIdInput()
    
  }


  function runDockerStopCommand() {
    const containerId = document.getElementById('containerIdInput').value;
    if (!containerId) {
      // displayErrorDialog('Please enter a Container ID.');
      containerIdInputFocus.focus()
      return;
    }
    runDockerCommand(`docker stop ${containerId}`);
    clearContainerIdInput()
    
  }

function runDockerComposeRunCommand(){
  const argsId = document.getElementById('arguments').value;
  if (!argsId) {
    // displayErrorDialog('Please enter a Container ID.');
    argsIdFocus.focus()
    return;
  }
  // runDockerCommand(`docker pause ${containerId}`);
  runDockerComposeCommand(`run ${argsId}`);
  // clearContainerIdInput()
}



  function runDockerRmiCommand() {
    const imageName = document.getElementById('imageNameInput').value;
    if (!imageName) {
      // displayErrorDialog('Please enter an Image Name.');
     imageNameInputFocus.focus()
      return;
    }
    runDockerCommand(`docker rmi ${imageName}`);
    clearImageInput()
  }

  function runDockerLoginCommand() {
    document.getElementById('docker-login-wrapper').style.display ='flex'
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    if (!userName) {
      // displayErrorDialog('Please enter an Image Name.');
     userNameFocus.focus()
      return;
    }
    if (!password) {
      // displayErrorDialog('Please enter an Image Name.');
     passwordFocus.focus()
      return;
    }
    runDockerCommand(`echo ${password} | docker login --username ${userName} --password-stdin`);
    // clearImageInput()
  }


 

  function runDockerPullCommand() {
    const imageNameInput = document.getElementById('imageNameInput').value;
    
    if (!imageNameInput) {
      // displayErrorDialog('Please enter an Image Name.');
      imageNameInputFocus.focus()
      return;
      
    }
  
    // Check if the image name includes a tag (indicated by a colon)
    const imageName = imageNameInput.includes(':') ? imageNameInput : `${imageNameInput}:latest`;
  
    runDockerCommand(`docker pull ${imageName}`);
    showNotification();
    clearImageInput()
  }


  function runDockerComposeCommand(action) {
    const filePath = document.getElementById('dockerComposeFileInput').value;
    if (!filePath) {
      displayErrorDialog('Please upload a docker-compose.yml file');
      return;
    }



    const command = `docker-compose -f ${filePath} ${action}`;
    dockerTerminal.write(`Running command: ${command}\r\n`);
    window.electronAPI.runCommand(command, 'docker');
    addCommandToHistory(command, 'docker');
    document.getElementById('clearSelection').style.display = 'flex';

    // clearFileInput();
  }



  function uploadComposeFile() {
    const fileInput = document.getElementById('dockerComposeFileUpload');
    fileInput.click();
  }






  
  // function runKubectlCommand(command) {
    
  //   kubernetesTerminal.write(`Running command: ${command}\r\n`);
  //     window.electronAPI.runCommand(command, 'kubernetes');
  //     addCommandToHistory(command, 'kubernetes')
  // }

  function clearTerminal(terminal) {
    terminal.clear();
  }
});



const originalContent = {
  pods: '',
  nodes: '',
  services: '',
  deployments: '',
  replicaset:''
};




function showKubernetesPods(output) {
  const podsContent = document.getElementById('podsContent');
  originalContent.pods = `<pre>${output}</pre>`;
  podsContent.innerHTML = originalContent.pods;
}

function showKubernetesNodes(output) {
  const nodesContent = document.getElementById('nodesContent');
  originalContent.nodes = `<pre>${output}</pre>`;
  nodesContent.innerHTML = originalContent.nodes;
}

function showKubernetesServices(output) {
  const servicesContent = document.getElementById('servicesContent');
  originalContent.services = `<pre>${output}</pre>`;
  servicesContent.innerHTML = originalContent.services;
}

function showKubernetesDeployments(output) {
  const deploymentsContent = document.getElementById('deploymentsContent');
  originalContent.deployments = `<pre>${output}</pre>`;
  deploymentsContent.innerHTML = originalContent.deployments;
}

function showKubernetesReplicaset(output) {
  const replicasetContent = document.getElementById('replicasetContent');
  originalContent.replicaset = `<pre>${output}</pre>`;
  replicasetContent.innerHTML = originalContent.replicaset;
}

function kubernetesItems() {
  const searchValue = document.getElementById('searchBox').value.toLowerCase();
  const activeTabContent = document.querySelector('.tab-content.active .toFind');
  const activeTabId = document.querySelector('.tab-content.active').id;

  if (activeTabContent) {
    if (searchValue === '') {
      // If search is cleared, restore original content
      activeTabContent.innerHTML = originalContent[activeTabId];
    } else {
      // Filter the content based on the search input
      const lines = originalContent[activeTabId].split('\n');
      const filteredLines = lines.filter(line => line.toLowerCase().includes(searchValue));
      activeTabContent.innerHTML = `<pre>${filteredLines.join('\n')}</pre>`;
    }
  }
}

// Event listener for search input
document.getElementById('searchBox').addEventListener('input', kubernetesItems);




  function showDockerImages(output) {
    const dockerImagesDiv = document.getElementById('dockerImages');
    dockerImagesDiv.innerHTML = `<pre>${output}</pre>`;
    // Add search functionality
  const searchDockerImages = document.getElementById('searchDockerImages');
  searchDockerImages.addEventListener('input', () => filterDockerImages(output));
  // click to copy 
  dockerImagesDiv.addEventListener('dblclick', copyToClipboard);
  }

  function showDockerContainers(output) {
    const dockerContainersDiv = document.getElementById('dockerContainers');
    dockerContainersDiv.innerHTML = `<pre>${output}</pre>`;
    // my search function here
  const searchDockerContainers = document.getElementById('searchDockerContainers');
  searchDockerContainers.addEventListener('input', () => filterDockerContainers(output));
 
  dockerContainersDiv.addEventListener('dblclick', copyToClipboard);
  }


  function filterDockerImages(output) {
    const searchValue = document.getElementById('searchDockerImages').value.toLowerCase();
    const dockerImagesDiv = document.getElementById('dockerImages');
    const lines = output.split('\n');
    const filteredLines = lines.filter(line => line.toLowerCase().includes(searchValue));
    dockerImagesDiv.innerHTML = `<pre>${filteredLines.join('\n')}</pre>`;
  }
  
  function filterDockerContainers(output) {
    const searchValue = document.getElementById('searchDockerContainers').value.toLowerCase();
    const dockerContainersDiv = document.getElementById('dockerContainers');
    const lines = output.split('\n');
    const filteredLines = lines.filter(line => line.toLowerCase().includes(searchValue));
    dockerContainersDiv.innerHTML = `<pre>${filteredLines.join('\n')}</pre>`;
  }

  async function copyToClipboard(event) {
    const selection = window.getSelection().toString();
  
    if (selection) {
      try {
        await navigator.clipboard.writeText(selection);
        showTextCopied()
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    } else {
      console.log('No text selected');
    }
  }


  function customDockerCommandExecution(){
    const commandInputElement = document.getElementById('customDockerCommand');
    const commandInput = commandInputElement.value.trim(); // Get the trimmed value
  
    const invalidCommand = document.getElementById('invalidCustomCommand');
  
    if (!commandInput) {
      // If the input is empty, focus on the command input element
      commandInputElement.focus();
      return;
    }
  
    if (commandInput.startsWith('docker')) {
      // If the command starts with 'docker', execute it using Electron API
      window.electronAPI.runCommand(commandInput, 'docker');
    } else {
      // If the command is invalid, show the invalid command message
      invalidCommand.style.display = 'block';
      setTimeout(function() {
        invalidCommand.style.display = "none";
      }, 4000);
    }
  
    // Clear the input value
    commandInputElement.value = '';
  }
document.getElementById('executeCommandBtn').addEventListener('click',customDockerCommandExecution)






window.electronAPI.onCommandOutput((output, dashboard, command) => {
    console.log(`Output received for ${dashboard} dashboard: ${output}`);
  
    const terminal = dashboard === 'docker' ? dockerTerminal : kubernetesTerminal;
  

    // Format the output for proper display
    const formattedOutput = formatOutput(output);
  



    // Write the formatted output to the terminal
    terminal.write(formattedOutput);

   


  const regex = /\b(Error response|no such)\b/i;
  if (regex.test(output)) {
    docErrorLogAnimation()
    showErrorMessage(output);
  }

  
  
  const regexForoutput = /\b(Pulling)\b/i;
  if (regexForoutput.test(output)) {
    showExecutionOutput(output);
  }

  const kubeRegex = /\b(error from server|Command failed)\b/i;
  if (kubeRegex.test(output)) {
    errorLogAnimation()
    showKubeErrorMessage(output);
    
  }


    // terminal.appendChild(commandOutput);S
    // terminal.scrollTop = terminal.scrollHeight;
  
  
    // Check if output is Docker images list
    if (output.startsWith('REPOSITORY')) {
    
      showDockerImages(output);
          
    }
  
    // Check if output is Docker containers list
    if (output.startsWith('CONTAINER ID')) {
      showDockerContainers(output);
    }
  
   
  

    const podsRequiredWords = ["NAME", "READY", "STATUS", "RESTARTS", "AGE"];
    if (podsRequiredWords.every(word => output.includes(word))) {
      showKubernetesPods(output);
    }


    const nodesRequiredWords = ["NAME", "STATUS", "ROLES", "AGE", "VERSION"];
    if (nodesRequiredWords.every(word => output.includes(word))) {
      showKubernetesNodes(output);
    }

    const servicesRequiredWords = ["NAME", "TYPE", "CLUSTER-IP", "EXTERNAL-IP", "PORT(S)", "AGE"];
    if (servicesRequiredWords.every(word => output.includes(word))) {
      showKubernetesServices(output);
    }

    const deploymentsRequiredWords = ["NAME", "READY", "UP-TO-DATE", "AVAILABLE", "AGE"];
    if (deploymentsRequiredWords.every(word => output.includes(word))) {
      showKubernetesDeployments(output);
    }

    const replicasetRequiredWords = ["NAME", "DESIRED", "CURRENT", "READY", "AGE"];
    if (replicasetRequiredWords.every(word => output.includes(word))) {
      showKubernetesReplicaset(output);
    }


  });






  
  function formatOutput(output) {
    // Replace newline characters with proper carriage return and newline
    return output.replace(/\n/g, '\r\n');
  }

// loader wala
  function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    // setTimeout(function() {
      document.getElementById('loader').style.display = 'none';
    // }, 13000);
}

function showNotification(){
  document.getElementById('notify').style.display = 'flex'
  // document.getElementById('notify').style.width = '25%'
  setTimeout(function() {
    // document.getElementById('notify').style.display = 'flex'
    document.getElementById('notify').style.display = 'none';
    // document.getElementsByClassName('notification-text').style.display = 'none';
  }, 4000);
}

function showTextCopied(){
  document.getElementById('textCopied').style.display = 'flex';
  setTimeout(function(){
    document.getElementById('textCopied').style.display = 'none'
  },3000)
}







function showErrorMessage(message) {
  const execError = document.getElementById('exec-error');
  // const execErrorMessage = document.getElementById('exec-error-message');
  const errorLog = document.getElementById('error-log');

  // Create a new div for the error entry
  const errorEntry = document.createElement('div');
  errorEntry.className = 'error-entry';

  // Create a span for the timestamp
  const timestamp = document.createElement('span');
  timestamp.className = 'error-timestamp';
  const now = new Date();
  timestamp.textContent = `[${now.toLocaleString()}]`;

  // Create a span for the error message
  const errorMessage = document.createElement('span');
  errorMessage.textContent = ` ${message}`;

  // Append timestamp and message to the error entry
  errorEntry.appendChild(timestamp);
  errorEntry.appendChild(errorMessage);

  // Append the error entry to the log
  errorLog.appendChild(errorEntry);

  // Show the error log container
  execError.style.display = "flex";

  // Optionally, scroll to the bottom of the log
  errorLog.scrollTop = errorLog.scrollHeight;
}







function showExecutionOutput() {
  const outputDiv = document.getElementById('exec-confir-output');
  outputDiv.innerHTML = ''; // Clear previous content

  const commandDiv = document.createElement('div');
  commandDiv.className = 'command-output';
  commandDiv.textContent = 'Command executed for : ' + lastCommand; // Display the last command

  outputDiv.appendChild(commandDiv);
  outputDiv.style.display = "flex";
  
  setTimeout(function() {
      outputDiv.style.display = "none";
  }, 4000);
}






function move() {
  var elem = document.getElementById("myBar");   
  var width = 0;
  var id = setInterval(frame, 30);
  document.getElementById('progress-bar').style.display ="flex"
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      hideLoader()
    } else {
      width++; 
      elem.style.width = width + '%'; 
      // elem.innerHTML = width * 1  + '%';
      
    }
  }
}

// Select all buttons
const buttons = document.querySelectorAll('.btn');

// Add click event listener to each button
buttons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked button
    this.classList.add('active');
  });
});

document.getElementById('launch').addEventListener('click', move);



function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");

  // Toggle the position of the button
  const toggleContainer = document.getElementById('darkModeToggle');
  toggleContainer.classList.toggle('active');
}

// Attach the function to the toggle container
document.getElementById('darkModeToggle').addEventListener('click', myFunction);