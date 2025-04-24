const Filter = (props) => {
    const { filter, handleFilter } = props

    return (
        <div>
            filter shown names <input value={filter} onChange={handleFilter}/>
        </div>
    )
}

export default Filter