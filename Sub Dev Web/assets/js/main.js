const app = Vue.createApp({
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      showLoginForm: false,
      showRegisterForm: false,
      showProducts: false,
      showCart: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: ''
      },
      users: [],
      products: [
        {
          id: 1,
          name: 'Apple iPhone 13 128GB Meia-noite Tela 6,1” 12MP',
          price: 'R$ 4298,99',
          image: 'https://a-static.mlcdn.com.br/800x560/apple-iphone-13-128gb-meia-noite-tela-61-12mp/magazineluiza/234661800/a57c1ab14765ab0b7ca87de98ba94b94.jpg',
          editing: false
        },
        {
          id: 2,
          name: 'Galaxy A34 128GB Preto 5G Octa-Core 6GB RAM',
          price: 'R$ 1699,20',
          image: 'https://a-static.mlcdn.com.br/800x560/smartphone-samsung-galaxy-a34-128gb-preto-5g-octa-core-6gb-ram-66-cam-tripla-selfie-13mp-dual-chip/magazineluiza/236822000/ae9f6793ae5b65eed65659776d7b94d5.jpg',
          editing: false
        },
        {
          id: 3,
          name: 'iPhone 11 Apple 128GB Branco 6,1” 12MP iOS',
          price: 'R$ 3419,10',
          image: 'https://a-static.mlcdn.com.br/800x560/iphone-11-apple-128gb-branco-61-12mp-ios/magazineluiza/155611200/af1cd7d9c89d7306b52490a0ce1b8b34.jpg',
          editing: false
        },
        {
          id: 4,
          name: 'Samsung Galaxy S23+ 512GB Preto 5G 8GB RAM',
          price: 'R$ 5699,00',
          image: 'https://a-static.mlcdn.com.br/800x560/smartphone-samsung-galaxy-s23-512gb-preto-5g-8gb-ram-66-cam-tripla-selfie-12mp/magazineluiza/232854900/1d4e3828b85c1dd539fc00565a84a484.jpg',
          editing: false
        },
        {
          id: 5 ,
          name: 'Moto G82 128GB Preto 5G Octa-Core 6GB RAM',
          price: 'R$ 2249,10',
          image: 'https://a-static.mlcdn.com.br/800x560/smartphone-motorola-moto-g82-128gb-preto-5g-octa-core-6gb-ram-66-cam-tripla-selfie-16mp/magazineluiza/235180900/1eae2b45396dff4600029120fb2719f1.jpg',
          editing: false
        }
      ],
      cart: []
    };
  },
  created() {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      this.users.push(JSON.parse(adminUser));
    }
  },
  methods: {
    toggleLoginForm() {
      this.showLoginForm = !this.showLoginForm;
      this.showRegisterForm = false;
      this.clearForms();
    },
    toggleRegisterForm() {
      this.showRegisterForm = !this.showRegisterForm;
      this.showLoginForm = false;
      this.clearForms();
    },
    toggleProducts() {
      this.showProducts = !this.showProducts;
      this.showCart = false;
    },
    toggleCart() {
      this.showCart = !this.showCart;
      this.showProducts = false;
    },
    login() {
      const { username, password } = this.loginForm;
      const user = this.users.find(
        (user) => user.username === username && user.password === password
      );
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = username === 'admin';
        this.showLoginForm = false;
        this.clearForms();
      } else {
        alert('Usuário ou senha incorretos.');
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.clearForms();
    },
    register() {
      const { username, password } = this.registerForm;
      const userExists = this.users.some((user) => user.username === username);
      if (userExists) {
        alert('Nome de usuário já está em uso.');
      } else {
        this.users.push({ username, password });
        if (username === 'admin' && password === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify({ username, password }));
        }
        this.showRegisterForm = false;
        alert('Registro realizado com sucesso. Faça login para continuar.');
        this.clearForms();
      }
    },
    addToCart(product) {
      if (this.isLoggedIn) {
        const cartItem = this.cart.find(
          (item) => item.product.id === product.id
        );
        if (cartItem) {
          cartItem.quantity++;
        } else {
          this.cart.push({ product, quantity: 1 });
        }
      } else {
        alert('Faça login ou registre-se para adicionar ao carrinho.');
        this.showLoginForm = true;
      }
    },
    removeFromCart(cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        const index = this.cart.findIndex(
          (item) => item.product.id === cartItem.product.id
        );
        if (index !== -1) {
          this.cart.splice(index, 1);
        }
      }
    },
    clearForms() {
      this.loginForm.username = '';
      this.loginForm.password = '';
      this.registerForm.username = '';
      this.registerForm.password = '';
    },
    goToHomePage() {
      window.location.href = '/';
    },
    editProduct(product) {
      if (this.isLoggedIn && this.isAdmin) {
        product.editing = true;
      } else {
        alert('Apenas o usuário admin tem permissão para editar produtos.');
      }
    },
    saveProduct(product) {
      product.editing = false;
      console.log('Produto editado:', product);
    },
    cancelEdit(product) {
      product.editing = false;
    },
    removeProduct(product) {
      if (this.isLoggedIn && this.isAdmin) {
        const index = this.products.findIndex(
          (item) => item.id === product.id
        );
        if (index !== -1) {
          this.products.splice(index, 1);
        }
      } else {
        alert('Apenas o usuário admin tem permissão para excluir produtos.');
      }
    },
    getTotalPrice() {
      return this.cart.reduce((total, item) => {
        const price = parseFloat(item.product.price.replace('R$', '').replace(',', '.'));
        return total + price * item.quantity;
      }, 0);
    },
    finalizarCompra() {
      if (this.cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
        return;
      }
      const total = this.getTotalPrice();
      alert(`Total da compra: R$ ${total.toFixed(2)}`);
      const formaPagamento = prompt('Selecione a forma de pagamento (Digite o número):\n1. Cartão de Crédito\n2. Boleto\n3. Transferência Bancária');
      if (formaPagamento === '1') {
        alert('Você selecionou Cartão de Crédito. Redirecionando para a página de pagamento...');
      } else if (formaPagamento === '2') {
        alert('Você selecionou Boleto. Aguarde o boleto ser gerado...');
      } else if (formaPagamento === '3') {
        alert('Você selecionou Transferência Bancária. Aguarde as instruções para realizar a transferência...');
      } else {
        alert('Forma de pagamento inválida.');
      }
    }
  }
});

app.mount('#app');
