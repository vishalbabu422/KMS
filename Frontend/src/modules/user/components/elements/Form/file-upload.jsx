export default function FileInput(props) {
    return (
        <>
            <input
                type="file"
                className={props.InputClass}
                id={props.InputId}
                // placeholder={props.InputPlaceHolder}
                required={props.InputRequired}
                
            />
        </>
    )
}



