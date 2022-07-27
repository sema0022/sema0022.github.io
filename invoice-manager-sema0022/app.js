// Serial number generator for new invoice numbers
function serialNumber (length) {
    const numbers = []

    for (let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * (91 - 65)) + 65
        numbers.push(String.fromCharCode(randomNumber))
    }

    return numbers.join('')
}  

// Root Vue component contains invoices.js data
const app = Vue.createApp({
    data: function () {
        return {
            invoices: invoices,
            show: false,
            client: '',
            amount: '',
            status: '',
            selected: 'All'
        }
    },
    // Retrieves any invoice data from local storage
    created: function () {
        const invoices = localStorage.getItem('invoices')

        if (invoices) {
            this.invoices = JSON.parse(invoices)
        }
    },
    methods: {
        // Adds a new invoice to the invoices array with given data
        newInvoice: function () {
            this.invoices.push({
                number: serialNumber(5),
                client: this.client,
                amount: this.amount,
                status: this.status
            })
            
            this.clearForm()
        },
        // Clears form inputs
        clearForm: function () {
            this.show = !this.show
            this.client = ''
            this.amount = ''
            this.status = ''
        },
        // Updates invoice data from child component
        updateInvoice: function (number, client, amount, status) {
            const invoice = this.invoices.find(invoice => invoice.number === number)
            invoice.client = client
            invoice.amount = amount
            invoice.status = status
        },
        // Deletes invoice with invoice number from child component
        deleteInvoice: function (number) {
            const invoice = this.invoices.findIndex(invoice => invoice.number === number)
            this.invoices.splice(invoice, 1)
        }
    },
    // Filters invoices based on status selected by user
    computed: {
        filteredInvoices() {
            if (this.selected === 'All') {
                return this.invoices
            }
            else {
                return this.invoices.filter(invoice => invoice.status === this.selected)
            }
        }
    },
    // Updates invoice data in local storage when changes are made
    watch: {
        invoices: {
            deep: true,
            handler: function (invoices) {
                localStorage.setItem('invoices', JSON.stringify(invoices))
            }
        }
    }
})

// Invoice component
app.component('invoice-item', {
    props: ['number', 'initialClient', 'initialAmount', 'initialStatus'],
    data: function () {
        return {
            show: false,
            client: this.initialClient,
            amount: this.initialAmount,
            status: this.initialStatus
        }
    },
    methods: {
        // Restores initial form inputs (called when update is cancelled)
        cancelUpdate: function () {
            this.show = !this.show
            this.client = this.initialClient
            this.amount = this.initialAmount
            this.status = this.initialStatus
        }
    },
    // Template consists of invoice and form to update it
    // The Edit button allows this form to appear
    template: `
        <div class="row border rounded bg-light p-3 mb-2 align-items-center">
            <div class="col-lg-2">
                <p class="fw-bold">#{{number}}</p>
            </div>
            <div class="col-md-4 col-lg-3">
                <p class="client">{{initialClient}}</p>
            </div>
            <div class="col-md-3 col-lg-2">
                <p class="amount">$ {{initialAmount}}</p>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-2 text-center">
                <p class="status alert alert-secondary fw-bold p-1">{{initialStatus}}</p>
            </div>
            <div class="col text-end align-self-start">
                <button class="btn btn-primary"
                    @click="show = !show"
                    v-show="!show">
                        Edit             
                </button>
                <button class="btn btn-secondary mb-3"
                    @click="cancelUpdate"
                    v-show="show"> 
                        Cancel
                </button>
            </div>
            <div class="col-12">
                <form class="row border rounded text-bg-dark p-3"
                    v-show="show"
                    @submit.prevent="$emit('update-invoice', number, client, amount, status)">
                        <h2 class="h4">Edit Invoice</h2>
                        <div class="col-lg-2">
                            <p class="fw-bold">#{{number}}</p>
                        </div>
                        <div class="col-md-4 col-lg-3">
                            <label class="form-label" for="client-name">Client Name</label>
                            <input class="form-control mb-3" type="text" name="client-name" id="client-name"
                                v-model="client">
                        </div>
                        <div class="col-md-3 col-lg-2">
                            <label class="form-label" for="add-amount">Amount</label>
                            <input class="form-control mb-3" type="number" name="add-amount" id="add-amount" 
                                v-model="amount">
                        </div>
                        <div class="col-8 col-sm-6 col-md-3 col-lg-2">
                            <label class="form-label" for="add-status">Invoice Status</label>
                            <select class="form-select mb-3" name="add-status" id="add-status"
                                v-model="status">
                                    <option value="Draft">Draft</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                            </select>
                        </div>
                        <div class="col text-end align-self-end mb-3">
                            <button type="submit" class="btn btn-primary"
                                @click="show = !show">
                                    Save
                            </button>
                        </div>
                        <div class="col-12 text-end my-4">
                            <button class="btn btn-danger"
                                @click="$emit('delete-invoice', number)">
                                Delete
                            </button>
                        </div>
                </form>
            </div>
        </div>`
})

const vm = app.mount('#app')