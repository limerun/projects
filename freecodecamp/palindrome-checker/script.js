const input = document.getElementById("text-input");
const btn = document.getElementById("check-btn");
const result = document.getElementById("result");
function submited() {
    const regex = /[\W_]/g;
    let organisedInput = input.value.replace(regex, "").toLowerCase();
    let reversedInput = organisedInput.split("").reverse().join("");
    if (input.value === "") {
        alert("Please input a value");
    }
    else if (organisedInput === reversedInput) {
        console.log(organisedInput);
        console.log(reversedInput);
        result.innerText = input.value;
        result.innerText = `${input.value} is a palindrome`;
    }
    else {
        result.innerText = `${input.value} is not a palindrome`;
    }
}
btn.addEventListener("click", submited);