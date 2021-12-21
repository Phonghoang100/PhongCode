//navrbar scroll
window.addEventListener('scroll', function(){
    const nav = document.querySelector('#mainNavbar');
    nav.classList.toggle('scrolled',window.scrollY > 0);
})

//text-animation
const typeTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor');


const textArray = [ 'A Web-Developer','Amazon Web Service Cloud Practioner', 'Amazon Web Service Solution Architech']; //the variables phrases 
const typingDelay = 100;            //delay before typing the next letter//
const erasingDelay = 0;           //miliseconds//
const newTextDelay = 100;          //delay between the current letter and the next//
let textArrayIndex = 0;             //letters will be reassign//
let charIndex = 0;                  //use to keep track of the characters//

function type(){
    if(charIndex < textArray[textArrayIndex].length){
        if(!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');   //adding the typing class to cursor, stop blinking when typing
        typeTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay + 2000) //erase//
        cursorSpan.classList.remove('typing'); //remove typing class after done typing
    }
}

function erase(){
    if(charIndex > 0){
        if(!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');    //remove blinking when done erasing
        typeTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, typingDelay); //erase the current textArray
    } else {
        cursorSpan.classList.remove('typing') //bring back blinking 
        textArrayIndex++; //set up the next textArray
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;   //reset textArray back to 0, so the process can continue to repeat
        setTimeout(type, typingDelay); //call for the type function 
    }
}


document.addEventListener('DOMContentLoaded', function(){
    //option 1: 
    type(); //function is apply when web is loaded//
    //option 2:
    //if(textArray.length)    //ensure that there is something in the array before typing
    //setTimeout(type, newTextDelay + 250);   //function is delay for 2secs after page is loaded
})