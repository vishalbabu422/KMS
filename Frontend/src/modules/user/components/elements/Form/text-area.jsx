export default function TextArea(props) {
    return (
        <>
            <textarea
                type="text"
                className={props.TextareaClass}
                id={props.TextareaId}
                placeholder={props.TextareaPlaceHolder}
                required={props.TextareaRequired}
            />
        </>
    )
}






