import React, {useState} from 'react';
import {htmlStringToHtmlCharArray} from '../common/utils';
import {response} from '../data/GrammarCheckData';

function GrammarCheck() {

    const htmlString = `<b>The oly thing we have to <span class='blue'><span class='big'>f</span>eer is fear</span> itself</b>`
    const htmlCharArray = htmlStringToHtmlCharArray(htmlString);

    const [html, setHtml] = useState(htmlString);

    const highlightErrors = (response, htmlCharArray) => {
      const newHtmlArray = [...htmlCharArray]; // create a new array
      for (let error of response) {
        const { startIndex, endIndex, replacement } = error;
        for (let i = startIndex; i <= endIndex; i++) {
          newHtmlArray[i] = `<span class='error tooltip' data-tooltip='${replacement}'>${newHtmlArray[i]}</span>`;
        }
      }
      return newHtmlArray; // return the new array with errors highlighted
    };

    const checkGrammar = async () => { 
      try{
        /* TODO: call the grammar check API
        const response = await callGrammarCheckAPI(htmlString);
        As of now getting response from GrammarCheckData.js
        */
        const newHtmlArray = highlightErrors(response, htmlCharArray);
        setHtml(newHtmlArray.join(''));
      } catch (error) {
        console.log(error);
      }
    }

    const fixErrors = () => {
        let lengthDiffPrev = 0; // initialize the length difference to 0
        for (let error of response) {
            const {startIndex, endIndex, replacement} = error;
            const correctedArray = getCorrectedArray(htmlCharArray, startIndex + lengthDiffPrev, endIndex, replacement);
            htmlCharArray.splice(startIndex + lengthDiffPrev, endIndex - startIndex + 1, ...correctedArray);
            lengthDiffPrev = replacement.length -(endIndex - startIndex + 1);
        }
        setHtml(htmlCharArray.join(''));
    };

    const getCorrectedArray = (htmlCharArray, startIndex, endIndex, replacement) => {
        const correctedArray = [];
        for (let j = 0; j < replacement.length; j++) {
            const correctedChar = getCorrectedChar(htmlCharArray[startIndex + j], replacement.charAt(j));
            correctedArray.push(correctedChar);
        }
        return correctedArray;
    };
    const selectInnermostSpan = (element) => {
        const lastSpan = element.querySelector("span:last-child");
        if (lastSpan) {
            return selectInnermostSpan(lastSpan);
        }
        return element;
    }
    const getCorrectedChar = (htmlChar, newChar) => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlChar, 'text/html');
        const spanElement = selectInnermostSpan(dom.querySelector('span:last-of-type'))
        spanElement.textContent = newChar;
        return dom.documentElement.outerHTML;
    };

    return (
        <div>
            <span dangerouslySetInnerHTML={
                {__html: html}
            }></span>
            <div>
                <button onClick={
                    () => {
                        checkGrammar()
                    }
                }>Check Grammar</button>
                <button onClick={
                    () => {
                        fixErrors()
                    }
                }>Fix Errors</button>
            </div>
        </div>
    );
}

export default GrammarCheck;
