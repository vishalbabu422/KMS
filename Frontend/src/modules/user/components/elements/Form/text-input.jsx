export default function TextInput(props) {
    return (
        <>
            <input
                type="text"
                className={props.InputClass}
                id={props.InputId}
                placeholder={props.InputPlaceHolder}
                required={props.InputRequired}
            />
        </>
    )
}
