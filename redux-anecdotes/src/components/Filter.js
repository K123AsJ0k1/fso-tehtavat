import { setFilter } from "../reducers/filterReducer"
import { connect } from 'react-redux' 
//import { useDispatch } from 'react-redux'

const Filter = (props) => {
    //const dispatch = useDispatch()
    const handleChange = (event) => {
        props.setFilter(event.target.value)
    }

    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} />
      </div>
    )
}
  
const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = {
  setFilter
}
  
export default connect(mapStateToProps,mapDispatchToProps)(Filter)