import mmpcLogo from '../assets/mmpc-logo.png'; // Ensure the path is correct
import '../styles/Header.css'; // Ensure styles are applied

export default function Header() {
    return (
        <div className="header">
            <img src={mmpcLogo} alt="Mitsubishi Logo" className="logo" />
            <span className="header-title">Mitsubishi Motors Philippines Corporation</span>
        </div>
    );
}
