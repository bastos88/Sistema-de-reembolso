// Selecionando os elementos do formulário
const form = document.querySelector("form");
const inputAmount = document.getElementById("amount");
const despesas = document.getElementById("expense");
const categoria = document.getElementById("category");

// Selecionando os elementos da ul.
const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

inputAmount.oninput = () => {
  // Aceitando somente números no campo de input
  let baseValue = inputAmount.value.replace(/\D/g, "");

  // transforma os valores em centavos
  baseValue = Number(baseValue) / 100;

  //atualiza o valor do input
  inputAmount.value = formatCurrency(baseValue);
};
// formata o valor no padrao BRL(Real brasileiro)
function formatCurrency(baseValue) {
  baseValue = baseValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return baseValue;
}

//Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrao do JS de recarregar a página ao clicar no botão submit
  event.preventDefault();

  // cria um objeto com os detalhes da nova despesa inserida pelo usuário
  const newExpenses = {
    id: new Date().getTime(),
    expense: despesas.value,
    category_id: categoria.value,
    category_name: categoria.options[categoria.selectedIndex].text,
    amount: inputAmount.value,
    created_at: new Date(),
  };
  expenseAdd(newExpenses);
};

// função que adciona um novo item na lista
function expenseAdd(newExpenses) {
  try {
    //cria o elemento para add o item(li) na lista (ul)

    const expenseItems = document.createElement("li");
    expenseItems.classList.add("expense");

    // cria o icon(img) e adciona os atributos
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpenses.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpenses.category_name);

    // Cria a div e adciona a classe
    const expenseDiv = document.createElement("div");
    expenseDiv.classList.add("expense-info");

    //cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpenses.expense;

    //cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpenses.category_name;

    // cria novo span para exibir o total das despesas
    const amountSpan = document.createElement("span");
    amountSpan.classList.add("expense-amount");

    // cria o small
    const smallValue = document.createElement("small");
    smallValue.textContent = "R$";

    // Cria o nó de texto com o valor numérico (sem o R$)
    const amountText = document.createTextNode(
      newExpenses.amount.replace("R$", "")
    );

    // cria o icon(remover) e adciona os atributos
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "/img/remove.svg");
    removeIcon.setAttribute("alt", "remove");

    // Adiciona o small e depois o texto numérico dentro do span
    amountSpan.append(smallValue);
    amountSpan.append(amountText);

    //adciona strong e span dentro da div expense-info
    expenseDiv.append(expenseCategory, expenseName);

    //adciona as informações no item
    expenseItems.append(expenseIcon, expenseDiv, amountSpan, removeIcon);

    // Adiciona o item na lista
    expenseList.append(expenseItems);

    // limpa o input
    formClear();

    // Atualiza os valores totais
    totalList();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas");
    console.log(error);
  }
}

// função para atualizar os valores totais e a quantidade de despesas na lista.

function totalList() {
  try {
    const items = expenseList.children;
    // atualiza a quantidade de itens da lista
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;
    // variavel pra incrementar o total
    let total = 0;

    // percorre cada item(li) da lista(ul)
    for (let i = 0; i < items.length; i++) {
      const itemAmount = items[i].querySelector(".expense-amount");

      // remove caracteres não numéricos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Converte valor para float
      value = parseFloat(value);

      // verifica se o numero é valido
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total, o valor não é um número"
        );
      }
      // incrementar o total

      total += Number(value);
    }

    // Cria a span para adcionar o R$ formatado
    const symbolBrl = document.createElement("small");
    symbolBrl.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pela small
    total = formatCurrency(total).toUpperCase().replace("R$", "");

    // limpa o conteúdo do elemento
    expensesTotal.innerHTML = "";

    // adciona o simbolo e o valor total formatado
    expensesTotal.append(symbolBrl, total);
  } catch (error) {
    console.log(error);
    alert("não foi possível atualizar os totais");
  }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function (event) {
  // Verificar se o elemento clicado é o ícone de remover
  if (event.target.classList.contains("remove-icon")) {
    // Encontra o elemento pai <li>
    const li = event.target.closest("li");
    // Remove o item da lista
    li.remove();
  }
  // Atualiza os totais
  totalList();
});

function formClear() {
  inputAmount.value = "";
  despesas.value = "";
  categoria.value = "";

  expense.focus();
}
