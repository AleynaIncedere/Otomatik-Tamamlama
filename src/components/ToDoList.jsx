import savedData from '../savedData';
import { useState, useEffect, useRef } from 'react';

export default function ToDoList() {
  const [listData, setListData] = useState(savedData);
  const [newItemInput, setNewItemInput] = useState('');
  const [autoCompleteRequested, setAutoCompleteRequested] = useState(false);
  const [inputInFocus, setInputInFocus] = useState(false);
  const listContainerRef = useRef(null);

  function handleCheckBoxChange(event) {
    setListData((prevList) => {
      return prevList.map((item) => {
        return item.id === event.target.name
          ? { ...item, complete: !item.complete }
          : item;
      });
    });
  }

  function handleNewItemInputChange(event) {
    setNewItemInput(event.target.value);
  }

  function handleEnter(event) {
    if (newItemInput.trim()) {
      if (event.key === 'Enter') {
        const newListItem = {
          text: newItemInput,
          complete: false,
          id: crypto.randomUUID(),
        };
        setListData((prevList) => [...prevList, newListItem]);
        setNewItemInput('');  // Clear input
        scrollToBottom();
      }
    }
  }

  function autoComplete() {
    setAutoCompleteRequested(true);
  }

  function toggleInputFocus() {
    setInputInFocus((prev) => !prev);
  }

  useEffect(() => {
    if (autoCompleteRequested) {
      let timeout = setTimeout(() => {
        setAutoCompleteRequested(false);
        setListData((prevData) => {
          return prevData.map((item) => ({
            ...item,
            complete: true,
          }));
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [autoCompleteRequested]);

  const scrollToBottom = () => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
    }
  };

  const currentList = listData.map((item) => {
    return (
      <div className='to-do-list-item-container' key={item.id}>
        <label className='checkbox-label'>
          <input
            type='checkbox'
            name={item.id}
            checked={item.complete}
            onChange={handleCheckBoxChange}
          />
          <span className='checkmark'></span>
          <p className={`to-do-list-item-text ${item.complete && 'crossed-out'}`}>
            {item.text}
          </p>
        </label>
        <div className='all-progress-bars-container'>
          {!item.complete && autoCompleteRequested && (
            <div className='progress-bar-container'>
              <div className='progress-bar-content'></div>
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className='to-do-list-container' ref={listContainerRef}>
        {currentList}
        <label className='new-item-label'>
          <img 
            src='./images/add-item.svg' 
            className={`add-item-icon ${inputInFocus ? 'faded' : ''}`} 
          />
          <input
            className='new-item-input'
            type='text'
            value={newItemInput}
            onKeyDown={handleEnter}
            onChange={handleNewItemInputChange}
            onFocus={toggleInputFocus}
            onBlur={toggleInputFocus}
          />
        </label>
      </div>
      <div className='do-it-button-container'>
        <button onClick={autoComplete}>Otomatik Tamamlama</button>
      </div>
    </div>
  );
}
