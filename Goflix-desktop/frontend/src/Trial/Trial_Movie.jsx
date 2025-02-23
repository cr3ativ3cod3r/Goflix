import Page1 from "./Page1.jsx";
import Page2 from "./Page2.jsx";
import Background from "./Background.jsx";
import Page3 from "./Page3.jsx";
import Page4 from "./Page4.jsx";

function Trial(props) {
    return (
        <div>
            <Background >
            <Page1 />
            <Page2 />
            <Page3 />
            <Page4 />
            </Background>
        </div>
    );
}

export default Trial;