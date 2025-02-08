const focusCounterPopupHtml = `<style>
  #userCounterPopup > div {
    margin-bottom: 100px;
  }

  #userCounterPopup svg {
    margin-bottom: 20px;
  }

  #userCounterPopup .digital-font {
    font-family: "Digital-7 Mono", "digital font", monospace;
  }

  #userCounterPopup .digit {
    position: absolute;
    display: block;
    width: 46px;
  }

  #userCounterPopup .digit__num {
    display: block;
    width: 46px;
    height: 76px;
    max-height: 76px;
    font-family: "Digital-7 Mono", "digital font", monospace;
  }

  #userCounterPopup .digit__num.placeholder {
    position: absolute;
  }

  #userCounterPopup .number__inner {
    display: flex;
  }

  #userCounterPopup .number_wrapper {
    position: relative;
    display: block; 
    width: 46px;
    height: 76px;
    max-height: 76px;
    overflow: hidden;
  }

  #userCounterPopup .number_wrapper .digit {
    transition: all ease-in-out 0.6s;
  }

  #userCounterPopup .number_wrapper.empty .digit:not(.placeholder) {
    opacity: 0;
  }

  #userCounterPopup .number_wrapper.number0 .digit {
    transform: translateY(0);
  } 

  #userCounterPopup .number_wrapper.number1 .digit {
    transform: translateY(calc(-76px * 1));
  } 

  #userCounterPopup .number_wrapper.number2 .digit {
    transform: translateY(calc(-76px * 2));
  } 

  #userCounterPopup .number_wrapper.number3 .digit {
    transform: translateY(calc(-76px * 3));
  } 

  #userCounterPopup .number_wrapper.number4 .digit {
    transform: translateY(calc(-76px * 4));
  } 

  #userCounterPopup .number_wrapper.number5 .digit {
    transform: translateY(calc(-76px * 5));
  } 

  #userCounterPopup .number_wrapper.number6 .digit {
    transform: translateY(calc(-76px * 6));
  } 

  #userCounterPopup .number_wrapper.number7 .digit {
    transform: translateY(calc(-76px * 7));
  } 

  #userCounterPopup .number_wrapper.number8 .digit {
    transform: translateY(calc(-76px * 8));
  } 

  #userCounterPopup .number_wrapper.number9 .digit {
    transform: translateY(calc(-76px * 9));
  } 
</style>

<div class="flex flex-col items-center justify-center gap-4">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97 27" class="h-auto " width="80" fill="#fff"><path d="M.593 7.607h4.673V4.195c0-2.522 1.631-4.153 4.079-4.153h4.82v3.782h-3.188c-.668 0-1.039.371-1.039 1.113v2.67h4.821v3.782H9.94V26H5.265V11.39H.593V7.606Zm15.617 9.196c0-6.007 4.154-9.716 9.642-9.716 5.488 0 9.642 3.709 9.642 9.716 0 6.008-4.154 9.716-9.642 9.716-5.488 0-9.642-3.708-9.642-9.716Zm4.673 0c0 3.56 2.076 5.637 4.969 5.637 2.892 0 4.97-2.077 4.97-5.637 0-3.56-2.078-5.636-4.97-5.636-2.893 0-4.97 2.076-4.97 5.636Zm16.549 0c0-5.71 4.227-9.716 9.567-9.716 5.118 0 8.233 3.004 9.049 7.12l-4.525.965c-.26-2.225-1.631-4.005-4.45-4.005-2.818 0-4.969 2.076-4.969 5.636s2.151 5.637 4.97 5.637c2.818 0 4.19-1.669 4.598-4.042l4.524 1.075c-1.038 4.042-4.042 7.046-9.197 7.046-5.34 0-9.567-4.005-9.567-9.716ZM76.952 26h-4.598v-2.744h-.371c-.742 1.557-2.3 3.04-5.674 3.04-4.302 0-7.157-3.151-7.157-7.713V7.607h4.672V18.36c0 2.781 1.41 4.153 3.931 4.153 2.856 0 4.525-2.002 4.525-5.414V7.607h4.672V26Zm3.847-13.239c0-3.634 2.893-5.673 7.269-5.673 4.116 0 6.823 2.04 7.713 5.006l-4.228 1.298c-.444-2.003-1.705-2.744-3.485-2.744-1.78 0-2.745.704-2.745 1.817 0 1.223 1.039 1.742 2.967 2.113l.964.186c4.154.816 7.269 1.854 7.269 5.71 0 3.857-3.041 6.045-7.714 6.045-4.82 0-8.047-2.15-8.677-6.007l4.301-1.113c.483 2.67 2.225 3.56 4.376 3.56 2.151 0 3.19-.927 3.19-2.114 0-1.186-1.039-1.742-3.338-2.188l-.964-.185c-3.857-.742-6.898-2.077-6.898-5.71Z"></path></svg>

  <div class="flex animate-fade flex-col items-center text-center animate-once relative">
    <div class="flex gap-4 sm:text-7xl leading-none text-green-600 bg-transparent">

      <div class="treeDigits" aria-label="00" role="img">
        <span class="number">
          <span class="number__inner">
            <span class="number_wrapper empty">
              <span class="digit__num placeholder opacity-15">8</span>

              <span class="digit animate-presence">
                <span class="digit__num number0">0</span>
                <span class="digit__num number1">1</span>
                <span class="digit__num number2">2</span>
                <span class="digit__num number3">3</span>
                <span class="digit__num number4">4</span>
                <span class="digit__num number5">5</span>
                <span class="digit__num number6">6</span>
                <span class="digit__num number7">7</span>
                <span class="digit__num number8">8</span>
                <span class="digit__num number9">9</span>
              </span>
            </span>

            <span class="number_wrapper empty">
              <span class="digit__num placeholder opacity-15">8</span>

              <span class="digit animate-presence">
                <span class="digit__num number0">0</span>
                <span class="digit__num number1">1</span>
                <span class="digit__num number2">2</span>
                <span class="digit__num number3">3</span>
                <span class="digit__num number4">4</span>
                <span class="digit__num number5">5</span>
                <span class="digit__num number6">6</span>
                <span class="digit__num number7">7</span>
                <span class="digit__num number8">8</span>
                <span class="digit__num number9">9</span>
              </span>
            </span>

            <span class="number_wrapper empty">
              <span class="digit__num placeholder opacity-15">8</span>

              <span class="digit animate-presence">
                <span class="digit__num number0">0</span>
                <span class="digit__num number1">1</span>
                <span class="digit__num number2">2</span>
                <span class="digit__num number3">3</span>
                <span class="digit__num number4">4</span>
                <span class="digit__num number5">5</span>
                <span class="digit__num number6">6</span>
                <span class="digit__num number7">7</span>
                <span class="digit__num number8">8</span>
                <span class="digit__num number9">9</span>
              </span>
            </span>
          </span>
        </span>
      </div>

      <div class="treeDigits" aria-label="00" role="img">
        <span class="number">
          <span class="number__inner">
            <span class="number_wrapper empty">
              <span class="digit__num placeholder opacity-15">8</span>

              <span class="digit animate-presence">
                <span class="digit__num number0">0</span>
                <span class="digit__num number1">1</span>
                <span class="digit__num number2">2</span>
                <span class="digit__num number3">3</span>
                <span class="digit__num number4">4</span>
                <span class="digit__num number5">5</span>
                <span class="digit__num number6">6</span>
                <span class="digit__num number7">7</span>
                <span class="digit__num number8">8</span>
                <span class="digit__num number9">9</span>
              </span>
            </span>

            <span class="number_wrapper empty">
              <span class="digit__num placeholder opacity-15">8</span>

              <span class="digit animate-presence">
                <span class="digit__num number0">0</span>
                <span class="digit__num number1">1</span>
                <span class="digit__num number2">2</span>
                <span class="digit__num number3">3</span>
                <span class="digit__num number4">4</span>
                <span class="digit__num number5">5</span>
                <span class="digit__num number6">6</span>
                <span class="digit__num number7">7</span>
                <span class="digit__num number8">8</span>
                <span class="digit__num number9">9</span>
              </span>
            </span>

            <span class="number_wrapper empty">
              <span class="digit__num placeholder opacity-15">8</span>

              <span class="digit animate-presence">
                <span class="digit__num number0">0</span>
                <span class="digit__num number1">1</span>
                <span class="digit__num number2">2</span>
                <span class="digit__num number3">3</span>
                <span class="digit__num number4">4</span>
                <span class="digit__num number5">5</span>
                <span class="digit__num number6">6</span>
                <span class="digit__num number7">7</span>
                <span class="digit__num number8">8</span>
                <span class="digit__num number9">9</span>
              </span>
            </span>
          </span>
        </span>
      </div>

    </div>
  </div>

  <div class="text-sm">users</div>
</div>`

export { focusCounterPopupHtml }
