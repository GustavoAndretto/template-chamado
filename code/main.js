var elements = {
    name: document.getElementById("name"),
    netUser: document.getElementById("netUser"),
    employeeId: document.getElementById("employeeId"),
    phone: document.getElementById("phone"),
    help: document.getElementById("help"),
    troubleshooting: document.getElementById("troubleshooting"),
    note: document.getElementById("note"),
    avaliable: document.getElementById("avaliable"),
    locale: document.getElementById("locale"),
    address: document.getElementById("address"),
    callStart: document.getElementById("callStart"),
    callEnd: document.getElementById("callEnd"),
    callNum: document.getElementById("callNum"),
    template: document.getElementById("template"),
    btnGenerate: document.getElementById("btnGenerate"),
    btnCopy: document.getElementById("btnCopy"),
    btnSave: document.getElementById("btnSave"),
    btnClear: document.getElementById("btnClear")
}

function formatTime(date) 
{
    var hours = date.getHours();
    var minutes = date.getMinutes();

    var strMin = minutes < 10 ? '0' + minutes : minutes;
    var strHours = hours < 10 ? '0' + hours : hours;

    var strTime = strHours + ':' + strMin;
    return strTime;
}

function updateTemplate()
{
    var strTemplate = "";

    if(elements.name.value){
        strTemplate += "•Nome Completo: " + elements.name.value + "\n";
    }
    if(elements.netUser.value) {
        strTemplate += "•Usuário de Rede: " + elements.netUser.value + "\n";
    }
    if(elements.employeeId.value) {
        strTemplate += "•Matrícula:" + elements.employeeId.value + "\n";
    }
    if(elements.phone.value) {
        strTemplate += "•Telefone: " + elements.phone.value + "\n";
    }
    if(elements.address.value) {
        strTemplate += "•Endereço: " + elements.address.value + "\n";
    }
    if(elements.avaliable.value) {
        strTemplate += "•Horário Disponível: " + elements.avaliable.value + "\n";
    }
    if(elements.locale.value) {
        strTemplate += "•Local de Trabalho: " + elements.locale.options[elements.locale.value].text + "\n";
    }
    if(elements.help.value) {
        strTemplate += "•Descrição detalhada:\n" + elements.help.value + "\n";
    }
    if(elements.troubleshooting.value) {
        strTemplate += "•Troubleshooting:\n" + elements.troubleshooting.value + "\n";
    }
    if(elements.note.value) {
        strTemplate += "•Observações:\n" + elements.note.value + "\n";
    }

    strTemplate = strTemplate.substring(0, strTemplate.length - 1);

    elements.template.value = strTemplate;
    elements.template.focus();
    M.textareaAutoResize(elements.template);

    M.toast({html: '<i class="material-icons dp48">send</i>&nbsp;Gerado.'});
}

function copyToClipboard(){
    var value = elements.template;

    value.select();
    value.setSelectionRange(0, 99999);

    document.execCommand("copy");

    M.toast({html: '<i class="material-icons dp48">content_copy</i>Copiado.'});
}

function save() {
    
    if(elements.callNum.value) {
        M.toast({html: "<i class=\"material-icons dp48\">save</i> O Chamado de número " + elements.callNum.value + " foi salvo."});
    }
    else{
        M.toast({html: "<i class=\"material-icons dp48\">error_outline</i> Insira o número do chamado."});
    }
}

function clear() {
    M.toast({html: '<i class="material-icons dp48">close</i> Limpo'});

    window.location.reload();
}

function initialize()
{
    var file = new FileReader();

    elements.phone.addEventListener("focus", function() {
        phoneMask.mask(elements.phone);
    });
    elements.phone.addEventListener("blur", function() {
        Inputmask.remove(elements.phone);
    });
    elements.avaliable.addEventListener("focus", function() {
        avaliableMask.mask(elements.avaliable);
    });
    elements.avaliable.addEventListener("blur", function() {
        Inputmask.remove(elements.avaliable);
    });
    elements.btnCopy.addEventListener("click", function() { 
        copyToClipboard();
    });
    elements.btnSave.addEventListener("click", function() {
        save();
    });
    elements.btnClear.addEventListener("click", function() {
        clear();
    });
    elements.btnGenerate.addEventListener("click", function() {
        updateTemplate();
    });

    var phoneMask = new Inputmask("+55 99 99999 9999", {placeholder: ''});
    var avaliableMask = new Inputmask("99:99 às 99:99");

    M.Timepicker.init(document.querySelectorAll('.timepicker'), {twelveHour:false});
    M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
    M.FormSelect.init(document.querySelectorAll('select'), {});

    elements.callStart.value = formatTime(new Date());
}

initialize();