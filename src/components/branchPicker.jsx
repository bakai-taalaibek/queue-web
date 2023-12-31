import { useServiceChooser } from "../utilities/zustand"
import { useNavigate } from 'react-router-dom'
import '../styles/mainStyles.scss'
import { useTranslation } from 'react-i18next'
import { useState, useRef } from 'react'
import arrow from '../assets/arrow.svg'


export const BranchPicker = () => {
  const { parameters, setBranch, allBranches, setBranchAddress } = useServiceChooser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const floatingWindowRef = useRef()
  const [listVisibility, setListVisibility] = useState(false)

  const handleListVisibility = (event) => {
    setListVisibility(!listVisibility)

    // To close the floating window by clicking anyware on the page
    document.addEventListener('mousedown', handler)
    function handler(event) {
      if (!floatingWindowRef.current?.contains(event.target)) {
        setListVisibility(false)
        document.removeEventListener('mousedown', handler)
      }
    }
  }

  const handleBranchChoice = (branch) => {
    setBranch(branch.id)
    setBranchAddress(branch.address)
    setListVisibility(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault
    navigate('../schedule')
  }

  return(
    <div className='glass-container glass-container--grid-3'>
      <p className="text">{ t('receiveingAnElectronicQueue') }</p>
      
      <button 
        onClick={ () => navigate(-1) } 
        className="arrow arrow--left"
      >
        <img src={ arrow } className="arrow__icon"></img>
      </button>  

      <div className='picker' >
        <p className="picker__label">{ t('step') } 2/5</p>

        <div 
          ref={ floatingWindowRef }
          className="picker__button"
          type='button'
          onClick={ handleListVisibility }
        >
          <span className="picker__inner-text">{ parameters.branchAddress || t('selectABranch') }</span>
          <span className="picker__arrow-symbol">&#8964;</span>          
        
          <div className="picker__list-container" style={{ visibility: listVisibility ? "visible" : "hidden" }}>
            { allBranches.filter(branch => branch.city === parameters.city).map((branch, index) => {
              return(
                <button  
                  className="picker__button picker__button--secondary"
                  key={ index }
                  type='button' 
                  // value={ branch.address }
                  onClick={ () => handleBranchChoice(branch) }
                >
                  <span className="picker__inner-text picker__inner-text--secondary">{ branch.address }</span>               
                </button>
              )
            })}
          </div>        
        
        </div>       

      </div>
      
      <button 
        style={{ display: parameters.branch ? '' : 'none' }} 
        onClick={ handleSubmit } 
        className="arrow arrow--right"
      >
        <img src={ arrow } className="arrow__icon"></img>
      </button>    
      
    </div>
  )
}