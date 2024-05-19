window.addEventListener('DOMContentLoaded', function() {
    const sectionsToClose = document.querySelectorAll('#function_name, #function_order, #function_print, #order_confirmation');
    sectionsToClose.forEach(section => {
      section.classList.add('close');
    });
  });
  
 var pedido = {
   mesa_num: "",
   cliente_nome: "",
   pedido_lista: [],
 };

 /*PASSO 1 - ARMAZENAR O NUMERO DA MESA */
 const buttonsContainer = document.getElementById("buttons_container");
 const buttons = document.querySelectorAll(".table_number");

 buttons.forEach((button) => {
   button.addEventListener("click", function (event) {
     pedido.mesa_num = event.target.value;
     localStorage.setItem("mesa_num", event.target.value);
     console.log("Pedido atual:", pedido);

     //esconde esse menu e mostra o próximo
     document.getElementById("function_table").classList.add("close");
     document.getElementById("function_name").classList.add("open");
   });
 });

 /*PASSO 2 - ARMAZENAR O NOME DO CLIENTE*/
 let nameInput = document.getElementById("input_nomeCliente");
 let nameSubmit = document.getElementById("input_submit");
 nameSubmit.addEventListener("click", function (event) {
   event.preventDefault();
   const userName = nameInput.value;
   pedido.cliente_nome = userName;
   localStorage.setItem("cliente_nome", userName);
   console.log("Pedido atual:", pedido);

   //esconde esse menu e mostra o próximo
   document.getElementById("function_name").classList.remove("open");
   document.getElementById("function_name").classList.add("close");
   document.getElementById("function_order").classList.add("open");
   document.querySelector(".rodape").style.position = "relative";
 });

 /*PASSO 3 - FUNCIONALIDADE DO CARDÁPIO*/
 const listContainer = document.querySelector("#data-output");
 const categoryFilter = document.getElementById("categoryFilter");
 let dataCache = [];
 const checkboxStates = {};
 function renderItems(data) {
   listContainer.innerHTML = "";
   data.forEach((item) => {
     const isChecked = checkboxStates[item.id] ? "checked" : "";
     listContainer.insertAdjacentHTML(
       "beforeend",
       `
               <div class="list_container" data-category="${item.categoria}">
                 <div class="list_box">
                   <span style="font-weight: bolder;">${item.nome}</span>
                   <span>${item.valor}</span>
                 </div>
                 <div class="hidden_content listMenuDescription">
                   <p>${item.descricao}</p>
                   <input type="checkbox" id="${item.nome}_${item.id}" name="${item.nome}" value="${item.nome}" ${isChecked}>
                 </div>
               </div>`
     );
   });

   // Add event listeners to .list_box elements
   document.querySelectorAll(".list_box").forEach((box) => {
     box.addEventListener("click", function () {
       const hiddenContent = this.nextElementSibling;
       if (hiddenContent.classList.contains("show")) {
         hiddenContent.classList.remove("show");
         setTimeout(() => {
           hiddenContent.style.display = "none";
         }, 500);
       } else {
         hiddenContent.style.display = "flex";
         setTimeout(() => {
           hiddenContent.classList.add("show");
         }, 0);
       }
     });
   });

   document.querySelectorAll('input[type="checkbox"]')
     .forEach((checkbox) => {
       checkbox.addEventListener("change", function () {
         const id = this.id.split("_")[1];
         checkboxStates[id] = this.checked;

         if (this.checked) {
           pedido.pedido_lista.push({ id, nome: this.value });
         } else {
           pedido.pedido_lista = pedido.pedido_lista.filter(
             (item) => item.id !== id
           );
         }

         console.log("Current pedido:", pedido);
       });
     });
 }

 function filterItems(category) {
   if (category === "All") {
     renderItems(dataCache);
   } else {
     const filteredData = dataCache.filter(
       (item) => item.categoria === category
     );
     renderItems(filteredData);
   }
 }

 fetch("./savepointcardapio.json")
   .then((response) => response.json())
   .then((data) => {
     dataCache = data;
     renderItems(dataCache);
   })
   .catch((error) => console.error("Error fetching JSON data:", error));

 categoryFilter.addEventListener("change", function () {
   filterItems(this.value);
 });
   

 /*PASSO 4 - IMPRIMIR NA TELA E COPIAR */
 document.querySelector('.btn_irParaJanelaFinal').addEventListener("click", function() {
 //esconde esse menu e mostra o próximo
 document.getElementById("function_order").classList.remove("open");
 document.getElementById("function_order").classList.add("close");
 document.getElementById("function_print").classList.add("open");
 document.querySelector(".rodape").style.position = "absolute";

 //carrega o display
 const mesaNumero = pedido.mesa_num;
 const mesaCliente = pedido.cliente_nome;
 const mesaPedido = pedido.pedido_lista;
 const pedidoJanela = document.getElementById('order-output');

 /*imprime o pedido pro atendente conferir*/
 pedidoJanela.innerHTML = `
     <p>${pedido.mesa_num}</p>
     <p>Comanda: ${pedido.cliente_nome}</p><br>
     <p>Pedido: </p>`;

 for (let i = 0; i < pedido.pedido_lista.length; i++) {
     pedidoJanela.innerHTML += `<span>${pedido.pedido_lista[i].nome}</span><br>`;
 }
});
 function copyToClipboard() {
     const pedidoJanela = document.getElementById('order-output');
     const textArea = document.createElement('textarea');

     // Set the value of the text area to the inner text of pedidoJanela
     textArea.value = pedidoJanela.innerText.replace(/\n\n/g, '\n');

     // Append the text area to the document body
     document.body.appendChild(textArea);

     // Select the text inside the text area
     textArea.select();

     // Copy the selected content to the clipboard
     document.execCommand('copy');

     // Remove the text area from the document body
     document.body.removeChild(textArea);
     document.getElementById("function_print").classList.remove("open");
     document.getElementById("function_print").classList.add("close");
     document.getElementById("order_confirmation").classList.remove("close");
     document.getElementById("order_confirmation").classList.add("open");
     

 }
 const btnCopy = document.getElementById('btn_copy');
 btnCopy.addEventListener('click', copyToClipboard);
 const btnReset = document.getElementById('reset-button'); 
 btnReset.addEventListener('click', function(){
 location.reload();
});