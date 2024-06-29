import React, {useState, useEffect, useRef} from 'react'
import FlashcardList from './FlashcardList'
import './App.css'
import axios from 'axios'

const App = () => {
  const [flashCards, setFlashcards] = useState(SAMPLE_FLASHCARDS)
  const [categories, setCategories] = useState()

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(()=> {
    axios.get('https://opentdb.com/api_category.php').then(res => {
      setCategories(res.data.trivia_categories.map( category => {
        return category
      }))
    })
  }, [])

  function decodeString(s) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = s
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios.get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const options = [...questionItem.incorrect_answers.map(a => decodeString(a)), answer]
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - .5)
        }
      }))
      console.log(res.data)
    }).catch((e) => {
      console.log(e)
      return 
    })
  }

  return (
    <>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories?.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>Number Of Questions</label>
          <input type='number' id='amount' min='1' step='1' defaultValue={10} ref={amountEl}/>
        </div>
        <div className='form-group'>
          <button className='btn'>Generate</button>
        </div>
      </form>
      <div className='container'>
        <FlashcardList flashcards={flashCards}/>
      </div>
    </>
  )
}

const SAMPLE_FLASHCARDS = [
  {
    id: 1, 
    question: 'What is the capital of France?',
    answer: 'Paris',
    options: [
      'London',
      'Berlin',
      'Paris',
      'Madrid'
    ]
  },
  {
    id: 2, 
    question: 'What is 2 + 2?',
    answer: '4',
    options: [
      '2',
      '3',
      '4',
      '5'
    ]
  }
]

export default App

