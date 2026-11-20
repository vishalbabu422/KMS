export default function LinkInput(props) {
    return (
        <>
            <input
                type="url"
                className={props.LinkClass}
                id={props.LinkId}
                placeholder={props.LinkPlaceHolder}
                required={props.LinkRequired}
            />
        </>
    )
}
