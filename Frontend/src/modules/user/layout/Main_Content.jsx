import Left from "./Left";
import Center from "./Center";
import Right from "./Right";

const Main = () => {
    return (
        <>

            <div className="d-flex flex-grow-1 ps-3 center" style={{ overflowY: "hidden" }}>
                <Left></Left>
                <Center></Center>
                <Right></Right>
            </div>

        </>
    )
};

export default Main;




