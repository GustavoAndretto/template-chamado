var dbTemplate = localforage.createInstance({ name: 'Template' });
var dbConfig = localforage.createInstance({ name: 'Config' });

function formatLocation(street, number, misc, neighborhood, city, state, cep) {
    return `${street}, ${number} ${misc}, ${neighborhood}, ${city} - ${state} - CEP ${cep}`;
}

new Vue({ 
    el: '#app', 
    vuetify: new Vuetify({
        theme: { dark: false }
    }),
    directives: { mask: VueMask.VueMaskDirective },
    data: {
        about: {
            author: "Gustavo Andretto",
            page: "https://github.com/gustavoandretto",
            version: "0.2",
            revision: "Sep, 16, 2021"
        },
        mask: {
            phone: '+55 (##) #####-####',
            cep: '#####-###',
            workTime: '##:## às ##:##',
            time: '##:##'
        },
        form: {
            employee: {
                id: null,
                name: null,
                user: null,
                phone: null,
                time: null,
                location: {
                    cep: '',
                    state: null,
                    city: null,
                    neighborhood: null,
                    street: null,
                    number: null,
                    misc: null,
                    desc: null,
                    all: null
                }
            },
            ticket: {
                id: null,
                description: null,
                troubleshooting: null,
                note: null,
                time: { 
                    start: null, 
                    end: null
                }
            }
        },
        placeholder: { workLocation: ['Home Office', 'Cliente', 'Escritório'] },
        error: { cep: [] },
        view: { address: false, template: false },
        validator: { address: false },
        template: { input: null, items: [], text: null }
    },
    methods: {
        resetForm() {
            this.$refs.form.reset();
        },
        cepChanged(value) {
            if(value.length == this.mask.cep.length) {
                cep(value).then((result) => {
                    this.form.employee.location.state = result['state'];
                    this.form.employee.location.neighborhood = result['neighborhood'];
                    this.form.employee.location.street = result['street'];
                    this.form.employee.location.city = result['city'];

                    this.error.cep = [];
                })
                .catch((e) => {
                    this.error.cep = ['CEP não encontrado'];
                })

                return;
            }

            this.error.cep = ['CEP inválido'];
        },
        updateForm(value) {
            if(value) { 
                this.form = value; 
            }
        },
        initDefault() {
            // TODO:
        },
        clearForm() {
            this.$refs.form.reset();

            if(this.$refs.formAddress){
                this.$refs.formAddress.reset();
                this.$refs.formAddress.resetValidation();

                // Reseta os erros de validação do cep.
                this.error.cep = [];
            }
        },
        insertAddress() {
            this.$refs.formAddress.validate();

            if(this.form.employee.location.number && this.form.employee.location.cep) {
                var location = this.form.employee.location;

                this.form.employee.location.all = formatLocation(location.street, location.number, !location.misc ? '' : location.misc,
                location.neighborhood, location.city, location.state, location.cep);

                this.view.address = false;
            }
        },
        isNightTheme() {
            return this.$vuetify.theme.dark == true;
        },
        setTheme(theme) {
            // Troca o tema conforme o valor inserido, o valor deve ser do tipo boleano.
            this.$vuetify.theme.dark = theme;
            dbConfig.setItem('theme', theme);
        },
        switchTheme(theme) { 
            this.setTheme(theme);
            
            // Remove o foco do botão após a troca do tema.
            document.activeElement.blur();
        },
        loadTheme() {
            // Promise que retorna o tema armazenado em cache.
            dbConfig.getItem('theme').then((value) => {
                this.setTheme(value);
            });
        },
        updateTemplateList() {
            // Promise que atualiza a lista de keys após a remoção do template.
            dbTemplate.keys().then((keys) => {
                this.template.items = keys;
            });
        },
        makeTemplate() {
            var strTemplate = '';

            if(this.form.employee.name){
                strTemplate += "•Nome Completo: " + this.form.employee.name + "\n";
            }
            if(this.form.employee.user) {
                strTemplate += "•Usuário de Rede: " + this.form.employee.user + "\n";
            }
            if(this.form.employee.id) {
                strTemplate += "•Matrícula: " + this.form.employee.id + "\n";
            }
            if(this.form.employee.phone) {
                strTemplate += "•Telefone: " + this.form.employee.phone + "\n";
            }
            if(this.form.employee.location.all) {
                strTemplate += "•Endereço: " + this.form.employee.location.all + "\n";
            }
            if(this.form.employee.time) {
                strTemplate += "•Horário Disponível: " + this.form.employee.time + "\n";
            }
            if(this.form.employee.location.desc) {
                strTemplate += "•Local de Trabalho: " + this.form.employee.location.desc + "\n\n";
            }

            console.log(this.form.ticket.description);

            if(this.form.ticket.description) {
                strTemplate += "•Descrição do Problema:\n" + this.form.ticket.description + "\n\n";
            }
            if(this.form.ticket.troubleshooting) {
                strTemplate += "•Troubleshooting:\n" + this.form.ticket.troubleshooting + "\n\n";
            }
            if(this.form.ticket.note) {
                strTemplate += "•Observações:\n" + this.form.ticket.note;
            }

            this.template.text = strTemplate;
        },
        saveTemplate() {
            if(this.template.input) {
                dbTemplate.setItem(this.template.input, this.form).then(() => {
                    this.updateTemplateList();
                });  
            }
        },
        deleteTemplate() {
            if(this.template.input) {
                dbTemplate.removeItem(this.template.input).then(() => {
                    // Atualiza a lista de templates.
                    this.updateTemplateList();

                    // Limpa o formulário após a exclusão do template.
                    this.clearForm();
                });
            }
        },
        selectTemplate() {
            if(this.template.input) {
                dbTemplate.getItem(this.template.input).then((value) => {
                    // Atualiza o formulário com o template selecionado.
                    this.updateForm(value);
                });
            }
        },
        showPage() {
            // Remove o elemento css 'hidden' da página
            document.getElementById('app').classList.remove('hidden');
        }
    },
    mounted() {
        // Atualiza a lista de templates após a criação da instância do Vue.
        this.updateTemplateList();

        // Carrega o tema escolhido.
        this.loadTheme();

        // Inicializa os valores padrão do formulário
        this.initDefault();

        // Exibe a página
        this.showPage();
    }
})