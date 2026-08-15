/* ==================================================
   HOMIC CONTRACT SYSTEM
   contract.js
================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /*
   * -----------------------------------------------
   * 契約番号
   * -----------------------------------------------
   */

  function createContractNumber(prefix = "HOMIC") {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${year}${month}${day}-${random}`;

  }


  /*
   * -----------------------------------------------
   * 日付
   * -----------------------------------------------
   */

  function getJapaneseDate() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    return `${year}年${month}月${day}日`;

  }


  /*
   * -----------------------------------------------
   * 利用規約
   * -----------------------------------------------
   */

  const termsCheck = document.getElementById("termsAgree");

  const termsButton = document.getElementById("termsButton");


  if (termsCheck && termsButton) {

    termsCheck.addEventListener("change", () => {

      termsButton.disabled = !termsCheck.checked;

    });


    termsButton.addEventListener("click", () => {

      if (!termsCheck.checked) {
        return;
      }

      localStorage.setItem(
        "homic_terms_agreed",
        "true"
      );

      localStorage.setItem(
        "homic_terms_agreed_at",
        new Date().toISOString()
      );

      alert(
        "利用規約への同意を確認しました。"
      );

      window.location.href = "contract.html";

    });

  }


  /*
   * -----------------------------------------------
   * 契約ページ
   * -----------------------------------------------
   */

  const contractNumber =
    document.getElementById("contractNumber");

  const contractDate =
    document.getElementById("contractDate");


  if (contractNumber) {

    let number =
      localStorage.getItem(
        "homic_contract_number"
      );


    if (!number) {

      number =
        createContractNumber();

      localStorage.setItem(
        "homic_contract_number",
        number
      );

    }


    contractNumber.textContent = number;

  }


  if (contractDate) {

    contractDate.textContent =
      getJapaneseDate();

  }


  const contractCheck =
    document.getElementById("contractAgree");

  const contractButton =
    document.getElementById("contractButton");


  if (contractCheck && contractButton) {

    contractCheck.addEventListener("change", () => {

      contractButton.disabled =
        !contractCheck.checked;

    });


    contractButton.addEventListener("click", () => {

      const name =
        document.getElementById(
          "customerName"
        )?.value.trim();


      const shop =
        document.getElementById(
          "shopName"
        )?.value.trim();


      const email =
        document.getElementById(
          "customerEmail"
        )?.value.trim();


      if (!name) {

        alert(
          "お名前を入力してください。"
        );

        return;

      }


      if (!shop) {

        alert(
          "店舗・会社名を入力してください。"
        );

        return;

      }


      if (!email) {

        alert(
          "メールアドレスを入力してください。"
        );

        return;

      }


      const agreement = {

        contractNumber:
          localStorage.getItem(
            "homic_contract_number"
          ),

        name: name,

        shop: shop,

        email: email,

        agreedAt:
          new Date().toISOString(),

        contractVersion:
          "1.0"

      };


      localStorage.setItem(

        "homic_contract_agreement",

        JSON.stringify(agreement)

      );


      alert(
        "契約内容への同意を確認しました。\n\n契約番号：" +
        agreement.contractNumber
      );


      window.location.href =
        "estimate.html";

    });

  }


  /*
   * -----------------------------------------------
   * 見積ページ
   * -----------------------------------------------
   */

  const estimateCheck =
    document.getElementById(
      "estimateAgree"
    );


  const estimateButton =
    document.getElementById(
      "estimateButton"
    );


  if (estimateCheck && estimateButton) {

    const agreement =
      localStorage.getItem(
        "homic_contract_agreement"
      );


    /*
     * 契約情報がない場合
     */

    if (!agreement) {

      estimateButton.disabled = true;

    }


    estimateCheck.addEventListener(
      "change",
      () => {

        estimateButton.disabled =
          !estimateCheck.checked ||
          !agreement;

      }
    );


    estimateButton.addEventListener(
      "click",
      () => {

        if (
          !estimateCheck.checked ||
          !agreement
        ) {

          return;

        }


        const data =
          JSON.parse(agreement);


        data.estimateAgreedAt =
          new Date().toISOString();


        localStorage.setItem(

          "homic_contract_agreement",

          JSON.stringify(data)

        );


        alert(
          "見積内容への同意を確認しました。\n\n" +
          "契約番号：" +
          data.contractNumber
        );


        /*
         * 現段階ではここで完了。
         *
         * 次の段階で
         *
         * Google Apps Script
         *
         * ↓
         *
         * Googleスプレッドシート
         *
         * へデータを送信する。
         */

      }
    );

  }


});
