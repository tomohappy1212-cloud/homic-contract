const API_URL =
  "https://script.google.com/macros/s/AKfycbxgL80KwpyjE2iDZV9JbXDfssrAZcvB2awwq6-oyI2ytOQ6qH5KDJCObxL02NloMAirdw/exec";


document.addEventListener("DOMContentLoaded", () => {

  const planInputs =
    document.querySelectorAll(
      'input[name="plan"]'
    );

  const optionInputs =
    document.querySelectorAll(
      ".option"
    );

  const totalElement =
    document.getElementById(
      "estimateTotal"
    );

  const summaryTotalElement =
    document.getElementById(
      "summaryTotal"
    );

  const selectedPlanElement =
    document.getElementById(
      "selectedPlan"
    );

  const selectedOptionsElement =
    document.getElementById(
      "selectedOptions"
    );

  const agreementCheckbox =
    document.getElementById(
      "estimateAgree"
    );

  const estimateButton =
    document.getElementById(
      "estimateButton"
    );

  const customerName =
    document.getElementById(
      "customerName"
    );

  const shopName =
    document.getElementById(
      "shopName"
    );

  const customerEmail =
    document.getElementById(
      "customerEmail"
    );


  function formatPrice(price) {

    return new Intl.NumberFormat(
      "ja-JP"
    ).format(price) + "円";

  }


  function getSelectedPlan() {

    const selected =
      document.querySelector(
        'input[name="plan"]:checked'
      );

    if (!selected) {
      return null;
    }

    return {

      name:
        selected.dataset.plan,

      price:
        Number(selected.value)

    };

  }


  function getSelectedOptions() {

    const selectedOptions = [];

    optionInputs.forEach(option => {

      if (option.checked) {

        selectedOptions.push({

          name:
            option.dataset.name,

          price:
            Number(option.value)

        });

      }

    });

    return selectedOptions;

  }


  function calculateTotal() {

    const plan =
      getSelectedPlan();

    const options =
      getSelectedOptions();

    let total = 0;


    if (plan) {

      total += plan.price;

    }


    options.forEach(option => {

      total += option.price;

    });


    return total;

  }


  function updateEstimate() {

    const plan =
      getSelectedPlan();

    const options =
      getSelectedOptions();

    const total =
      calculateTotal();


    totalElement.textContent =
      formatPrice(total);

    summaryTotalElement.textContent =
      formatPrice(total);


    if (plan) {

      selectedPlanElement.textContent =
        `${plan.name} / ${formatPrice(plan.price)}`;

    } else {

      selectedPlanElement.textContent =
        "未選択";

    }


    if (options.length === 0) {

      selectedOptionsElement.textContent =
        "なし";

    } else {

      selectedOptionsElement.innerHTML =
        options
          .map(option =>
            `${option.name} (+${formatPrice(option.price)})`
          )
          .join("<br>");

    }


    updateButton();

  }


  function updateButton() {

    if (!estimateButton) {
      return;
    }


    const plan =
      getSelectedPlan();

    const agreed =
      agreementCheckbox &&
      agreementCheckbox.checked;

    const customer =
      customerName &&
      customerName.value.trim() !== "";

    const email =
      customerEmail &&
      customerEmail.value.trim() !== "";


    estimateButton.disabled =
      !(
        plan &&
        agreed &&
        customer &&
        email
      );

  }


  planInputs.forEach(input => {

    input.addEventListener(
      "change",
      updateEstimate
    );

  });


  optionInputs.forEach(input => {

    input.addEventListener(
      "change",
      updateEstimate
    );

  });


  [
    customerName,
    shopName,
    customerEmail

  ].forEach(input => {

    if (!input) {
      return;
    }

    input.addEventListener(
      "input",
      updateButton
    );

  });


  if (agreementCheckbox) {

    agreementCheckbox.addEventListener(
      "change",
      updateButton
    );

  }


  estimateButton.addEventListener(
    "click",
    async () => {

      const plan =
        getSelectedPlan();

      const options =
        getSelectedOptions();

      const total =
        calculateTotal();


      if (!plan) {

        alert(
          "プランを選択してください。"
        );

        return;

      }


      if (
        !customerName.value.trim()
      ) {

        alert(
          "お客様名を入力してください。"
        );

        return;

      }


      if (
        !customerEmail.value.trim()
      ) {

        alert(
          "メールアドレスを入力してください。"
        );

        return;

      }


      if (
        !agreementCheckbox.checked
      ) {

        alert(
          "お見積り内容を確認してください。"
        );

        return;

      }


      const now =
        new Date();


      const contractNumber =
        "HOMIC-" +
        now.getFullYear() +
        String(
          now.getMonth() + 1
        ).padStart(2, "0") +
        String(
          now.getDate()
        ).padStart(2, "0") +
        "-" +
        Math.floor(
          1000 +
          Math.random() * 9000
        );


      const estimateData = {

        contractNumber,

        customerName:
          customerName.value.trim(),

        shopName:
          shopName.value.trim(),

        email:
          customerEmail.value.trim(),

        plan: {

          name:
            plan.name,

          price:
            plan.price

        },

        options,

        total,

        confirmedAt:
          now.toISOString()

      };


      estimateButton.disabled =
        true;

      estimateButton.textContent =
        "送信中…";


      try {

        await fetch(
          API_URL,
          {

            method: "POST",

            mode: "no-cors",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body:
              JSON.stringify(
                estimateData
              )

          }
        );


        localStorage.setItem(
          "homicEstimate",
          JSON.stringify(
            estimateData
          )
        );


        localStorage.setItem(
          "homicEstimateConfirmed",
          "true"
        );


        alert(

          "お見積り内容を確定しました。\n\n" +

          "契約番号：\n" +
          contractNumber +
          "\n\n" +

          "総支払額：\n" +
          formatPrice(total) +
          "\n\n" +

          "この画面をスクリーンショットして保存してください。\n\n" +

          "その後、HOMIC指定の方法でお支払いください。\n\n" +

          "入金確認後、HOMICから確認メールをお送りします。"

        );


        estimateButton.textContent =
          "お見積り確定済み ✓";


      } catch (error) {

        console.error(
          error
        );


        alert(

          "送信中にエラーが発生しました。\n\n" +

          "画面の内容をスクリーンショットして保存し、HOMICまでお問い合わせください。"

        );


        estimateButton.disabled =
          false;

        estimateButton.textContent =
          "見積内容を確定する";

      }

    }
  );


  updateEstimate();

});
