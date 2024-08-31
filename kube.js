let kubernetesCommandHistory = [];
let kubernetesTerminal;
let mainInputFocus = document.getElementById('kubectlCommandInput');
let deploymentNameFocus = document.getElementById('deploymentName');
let imageNameFocus = document.getElementById('imageName');
let portFocus = document.getElementById('port');
let kubeFilePathInput = document.getElementById('kubeFileInput');

function initializeKubernetesTerminal() {
    kubernetesTerminal = new Terminal({
        fontSize: 13, 
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
    kubernetesTerminal.open(document.getElementById('kubernetesTerminalContainer'));
  }


  function clearTerminal(terminal) {
    terminal.clear();
  }


  document.getElementById('clearKubernetesTerminalButton').addEventListener('click', function() {
    clearTerminal(kubernetesTerminal);
  });



  function addCommandToHistory(command, dashboard) {
    const timestamp = new Date().toLocaleString();
     if (dashboard === 'kubernetes') {
        kubernetesCommandHistory.push({ command, timestamp });
    }
}




function runKubectlCommand(command) {
    
    kubernetesTerminal.write(`Running command: ${command}\r\n`);
      window.electronAPI.runCommand(command, 'kubernetes');
      addCommandToHistory(command, 'kubernetes')
  }



  function customKubernetesCommandExecution(){
    const mainCommandInput = document.getElementById('kubectlCommandInput')
    const mainInput = mainCommandInput.value.trim()
    const invalidKubeCommand = document.getElementById('invalidCustomKubeCommand');
    if (!mainInput) {
      mainInputFocus.focus();
      return;
    }

    if (mainInput.startsWith('kubectl')) {
      // If the command starts with 'docker', execute it using Electron API
      window.electronAPI.runCommand(mainInput, 'kubernetes');
    } else {
      // If the command is invalid, show the invalid command message
      invalidKubeCommand.style.display = 'block';
      setTimeout(function() {
        invalidKubeCommand.style.display = "none";
      }, 4000);
    }
    mainInput.value = '';
    
    }
  
  document.getElementById('runKubectlCommandButton').addEventListener('click', customKubernetesCommandExecution);



function createDeployment(){
    const deploymentName = document.getElementById('deploymentName');
    const imageName = document.getElementById('imageName')
    const setDeploymentName = deploymentName.value.trim();
    const setImageName = imageName.value.trim();
    if(!setDeploymentName){
        deploymentNameFocus.focus();
        return;
    }
    if(!setImageName){
        imageNameFocus.focus();
        return;
    }
  
    runKubectlCommand(`kubectl create deployment ${setDeploymentName} --image=${setImageName}`);
    clearDeploymentNameInput()
    clearImageNameInput()
}

document.getElementById('kubectlCreateDeploymentButton').addEventListener('click', createDeployment);








function exposeDeployment() {
  const deploymentName = document.getElementById('deploymentName');
  const port = document.getElementById('port');
  const type = document.getElementById('type');
  
  const setPort = port.value.trim();
  const setDeploymentName = deploymentName.value.trim();
  const setType = type.value;
  
  if (!setDeploymentName) {
    deploymentName.focus();
    return;
  }
  if (!setPort) {
    port.focus();
    return;
  }

  runKubectlCommand(`kubectl expose deployment ${setDeploymentName} --type=${setType} --port=${setPort}`);
  clearDeploymentNameInput()
}

document.getElementById('kubectlExposeDeploymentButton').addEventListener('click', exposeDeployment);


function scaleReplica() {
  const scaleReplica = document.getElementById('Scalereplica');

  const filePath = document.getElementById('kubeFileInput').value;
  if (!filePath) {
    displayDefErrorDialog('Please upload a definition.yml file');
    return;
  }
  
  const setScaleReplica = scaleReplica.value.trim();

  
  if (!setScaleReplica) {
    scaleReplica.focus();
    return;
  }
  const command = `kubectl scale --replicas=${setScaleReplica} -f ${filePath}`;
  kubernetesTerminal.write(`Running command: ${command}\r\n`);
  window.electronAPI.runCommand(command, 'kubernetes');
  addCommandToHistory(command, 'kubernetes');
  document.getElementById('defClearSelection').style.display = 'flex';

  // runKubectlCommand(`kubectl expose deployment ${setDeploymentName} --type=${setType} --port=${setPort}`);
}

document.getElementById('kubectlScaleReplicaButton').addEventListener('click', scaleReplica);


function deletePod(){
  const podName = document.getElementById('podName');
  const setPodName = podName.value.trim();
  if(!setPodName){
    podName.focus()
    return
  }
  runKubectlCommand(`kubectl delete pod ${setPodName}`);
  clearPodInput()
}
document.getElementById('kubectlDeletePodButton').addEventListener('click', deletePod);



function describePod(){
  const podName = document.getElementById('podName');
  const setPodName = podName.value.trim();
  if(!setPodName){
    podName.focus()
    return
  }
  runKubectlCommand(`kubectl describe pod ${setPodName}`);
  clearPodInput()
}
document.getElementById('kubectlDescribePodButton').addEventListener('click', describePod);



function deleteServices(){
  const deploymentName = document.getElementById('deploymentName');
  const setDeploymentName = deploymentName.value.trim();
  if (!setDeploymentName) {
    deploymentName.focus();
    return;
  }
  runKubectlCommand(`kubectl delete services ${setDeploymentName}`);
  clearDeploymentNameInput()
}
document.getElementById('kubectltDeleteServicesButton').addEventListener('click', deleteServices);



function deleteDeployment(){
  const deploymentName = document.getElementById('deploymentName');
  const setDeploymentName = deploymentName.value.trim();
  if (!setDeploymentName) {
    deploymentName.focus();
    return;
  }
  runKubectlCommand(`kubectl delete deployment ${setDeploymentName}`);
  clearDeploymentNameInput()
}
document.getElementById('kubectlDeletetDeploymentButton').addEventListener('click', deleteDeployment);


function getLogs(){
  const podName = document.getElementById('podName');
  const setPodName = podName.value.trim();
  if(!setPodName){
    podName.focus()
    return
  }
  runKubectlCommand(`kubectl logs ${setPodName}`);
  clearPodInput()
}
document.getElementById('kubectlGetLogsButton').addEventListener('click', getLogs);


// GET URL FUNCTION STARTS
function getUrl(){
  const deploymentName = document.getElementById('deploymentName'); 
  const setDeploymentName = deploymentName.value.trim();
  if(!setDeploymentName){
    deploymentNameFocus.focus();
        return;
  }
  runKubectlCommand(`minikube service ${setDeploymentName} --url`)
  clearDeploymentNameInput()
}
document.getElementById('kubectlGetUrlButton').addEventListener('click', getUrl)
// GET URL FUNCTION ENDS





function rollbackUndo(){
  const deploymentName = document.getElementById('deploymentName'); 
  const setDeploymentName = deploymentName.value.trim();
  if(!setDeploymentName){
    deploymentNameFocus.focus();
        return;
  }
  runKubectlCommand(`kubectl rollout undo deployment/${setDeploymentName}`)
  clearDeploymentNameInput()
  
}
document.getElementById('kubectlRolloutUndoButton').addEventListener('click', rollbackUndo)




  document.getElementById('kubectlGetNodesButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get nodes');
  });

  document.getElementById('kubectlGetPodsButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get pods');
  });

  document.getElementById('minikubeStartButton').addEventListener('click', function() {
    runKubectlCommand('minikube start');
  });


  document.getElementById('kubectlGetServicesButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get services');
    
  });
  

  document.getElementById('kubectlGetDeploymentButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get deployments');
  });

  document.getElementById('clearKubernetesTerminalButton').addEventListener('click', function() {
    clearTerminal(kubernetesTerminal);
  });

  document.getElementById('kubectlGetNamespacesButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get namespaces');
    
  });

  document.getElementById('kubectlGetEventsButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get events');
  });


  document.getElementById('kubectlGetReplicasetButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get replicaset');
  });


  document.getElementById('kubectlGetAllButton').addEventListener('click', function() {
    runKubectlCommand('kubectl get all');
  });
  
//   const powerButton = document.getElementById('powerButton');
// const powerIcon = document.getElementById('powerIcon');
// let isPoweredOn = false;

// powerButton.addEventListener('click', function() {
//   if (isPoweredOn) {
//     powerIcon.src = 'assets/icons/power-off.png';
//       runKubectlCommand('minikube stop');
      
  
//   } else {
//     powerIcon.src = 'assets/icons/power-on.png';
//       runKubectlCommand('minikube start');
     
//   }
//   isPoweredOn = !isPoweredOn;
// });



document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab, .tab-content').forEach(item => {
      item.classList.remove('active');
    });

    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});





function runKubeDefCommand() {
  const filePath = document.getElementById('kubeFileInput').value;
  if (!filePath) {
    displayDefErrorDialog('Please upload the configuration file you want to use to create a resource.');
    return;
  }

  const command = `kubectl create -f ${filePath}`;
  kubernetesTerminal.write(`Running command: ${command}\r\n`);
  window.electronAPI.runCommand(command, 'kubernetes');
  addCommandToHistory(command, 'kubernetes');
  document.getElementById('defClearSelection').style.display = 'flex';

  // clearFileInput();
}
document.getElementById('kubectlRunDefFile').addEventListener('click', runKubeDefCommand)



function runKubectlApply() {
  const filePath = document.getElementById('kubeFileInput').value;
  if (!filePath) {
    displayDefErrorDialog('Please upload the configuration file you want to use to apply the changes.');
    return;
  }

  const command = `kubectl apply -f ${filePath}`;
  kubernetesTerminal.write(`Running command: ${command}\r\n`);
  window.electronAPI.runCommand(command, 'kubernetes');
  addCommandToHistory(command, 'kubernetes');
  document.getElementById('defClearSelection').style.display = 'flex';

  // clearFileInput();
  clearDefFileInput()
}
document.getElementById('kubectlApplyButton').addEventListener('click', runKubectlApply)




// Initialize CodeMirror for the Docker Compose editor
const kubeDefEditor = CodeMirror(document.getElementById('kubeDefEditor'), {
  lineNumbers: true,
  mode: 'yaml',
  theme: 'material',
});

// Set up event listeners
document.getElementById('createDefinitionFileBtn').addEventListener('click', function() {
  const modal = document.getElementById('kubeDefModal');
  const defaultKubeDefContent = `
  apiVersion: v1
  kind: Pod
  metadata:
    name: my-pod
  spec:
    containers:
    - name: my-container
      image: nginx:latest
`;
modal.style.display = 'block';

kubeDefEditor.setValue(defaultKubeDefContent);
  
});

setTimeout(() => {
    kubeDefEditor.refresh();
}, 100);


document.getElementById('saveDefinitionBtn').addEventListener('click', function() {
  const content = kubeDefEditor.getValue(); // Use CodeMirror's getValue method
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'definition.yml';
  a.click();
  URL.revokeObjectURL(a.href);
});





function clearDefFileInput() {
  const fileInput = document.getElementById('kubeFileUpload');
  const uploadedFileName = document.getElementById('kubeUploadedFileName');
  fileInput.value = '';
  uploadedFileName.textContent = 'no file chosen';
  uploadedFileName.style.color = "white";
  console.log("File input cleared");
  kubeFilePathInput.value = '';
}




document.getElementById('kubeFileUpload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const kubeUploadedFileName = document.getElementById('kubeUploadedFileName');
    kubeFilePathInput.value = file.path;
    kubeUploadedFileName.textContent = `File uploaded: ${file.name}`;
    kubeUploadedFileName.style.color = "#FF7F11"; // optional: change the text color to orange
  }
  document.getElementById('defClearSelection').style.display = 'flex';
});
document.getElementById('defClearSelection').addEventListener('click', clearDefFileInput)


function displayDefErrorDialog(message) {
  const defErrorDialog = document.getElementById('defErrorDialog');
  const defErrorMessage = document.getElementById('defErrorMessage');

  defErrorMessage.textContent = message;
  defErrorDialog.style.display = 'flex';

  // dialog closing if clicked anywhere inside dom
  defErrorDialog.addEventListener('click', function(event) {
    if (event.target === defErrorDialog) {
      closeDefErrorDialog();
    }
  });

  // Close the dialog when clicking the close button
  document.getElementById('closeDefErrorDialog').addEventListener('click', closeDefErrorDialog);

  
  // Function to close the error dialog
  function closeDefErrorDialog() {
    defErrorDialog.style.display = 'none';
  }
}


function clearDeploymentNameInput(){
  const clearDeploymentName = document.getElementById('deploymentName');
  clearDeploymentName.value ='';
}

function clearImageNameInput(){
  const clearImageName = document.getElementById('imageName');
  clearImageName.value ='';
}

function clearPodInput(){
  const clearPod = document.getElementById('podName');
  clearPod.value ='';
}





const powerButton = document.getElementById('powerButton');
const powerIcon = document.getElementById('powerIcon');
const loaderContainer = document.getElementById('loaderContainer');
const loaderMessage = document.getElementById('loaderMessage');
const statusOutput = document.getElementById('minikubeStatusOutput');
let isPoweredOn = false;

powerButton.addEventListener('click', function() {
  if (isPoweredOn) {
    toggleMinikube('minikube stop', 'Stopping Minikube...');
  } else {
    toggleMinikube('minikube start', 'Starting Minikube...');
  }
});

function toggleMinikube(command, message) {
  statusOutput.style.display = 'none';
  loaderMessage.innerText = message;
  loaderContainer.style.display = 'flex';

  window.electronAPI.runCommand(command, 'minikube-toggle');
}

function checkMinikubeStatus() {
  const command = 'minikube status';
  const dashboard = 'minikube-status';
  window.electronAPI.runCommand(command, dashboard);
}

window.electronAPI.onCommandOutput((output, dashboard) => {
  if (dashboard === 'minikube-status') {
    if (output.includes('Error')) {
      statusOutput.innerText = 'Error checking Minikube status.';
    } else if (output.includes('host: Running')) {
      statusOutput.innerText = 'Minikube is running...';
      powerIcon.src = 'assets/icons/power-on.png';
      isPoweredOn = true;
    } else {
      statusOutput.innerText = 'Minikube is not running.';
      powerIcon.src = 'assets/icons/power-off.png';
      isPoweredOn = false;
    }
    // Show the status and hide the loader
    statusOutput.style.display = 'block';
    loaderContainer.style.display = 'none';
  }

  if (dashboard === 'minikube-toggle') {
    setTimeout(() => {
      checkMinikubeStatus();
    }, 2000);
  }
});

const elements = document.getElementsByClassName('checkMinikubeStatus');

for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', checkMinikubeStatus);
}
















function showKubeErrorMessage(message) {
  const execError = document.getElementById('exec-error');
  // const execErrorMessage = document.getElementById('exec-error-message');
  const errorLog = document.getElementById('kube-error-log');

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










function errorLogAnimation() {
  const changeColor = document.getElementById('error-zone');
  const zoneArrow = document.getElementById('error-zone-arrow');
  const colors = ['#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#FF7F11'];
  const interval = 100; 

  
  zoneArrow.style.borderTopColor = 'red';
  zoneArrow.style.borderLeftColor = 'red';

  colors.forEach((color, index) => {
    setTimeout(() => {
      changeColor.style.color = color;
    }, interval * index);
  });

 
  setTimeout(() => {
    zoneArrow.style.borderTopColor = '#FF7F11';
    zoneArrow.style.borderLeftColor = '#FF7F11';
  }, interval * colors.length);

  console.log("working");
}


function docErrorLogAnimation() {
  const changeColor = document.getElementById('doc-error-zone');
  const zoneArrow = document.getElementById('doc-error-zone-arrow');
  const colors = ['#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#343434', 'red', '#FF7F11'];
  const interval = 100; 

  
  zoneArrow.style.borderTopColor = 'red';
  zoneArrow.style.borderLeftColor = 'red';

  colors.forEach((color, index) => {
    setTimeout(() => {
      changeColor.style.color = color;
    }, interval * index);
  });

 
  setTimeout(() => {
    zoneArrow.style.borderTopColor = '#FF7F11';
    zoneArrow.style.borderLeftColor = '#FF7F11';
  }, interval * colors.length);

  console.log("working for docker error log");
}



