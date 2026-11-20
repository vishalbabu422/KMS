export default function SelectForm(props) {
    return (
        <>

            <select 
            className={props.SelectClass}
            id={props.SelectId}>

                <option value="">Select</option>
                {Object.keys(props.selectOption).map((key) => (
                    <option value={key}>{props.selectOption[key]}</option>
                ))}
            </select>
        </>
    )
}






