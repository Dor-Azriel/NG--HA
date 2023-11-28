import styles from './Card.module.css';


// React component for a card container
const Card = (props) => {
    return (
        // Outer container for the card
        <div className={styles['card-container']}>
            {/* Inner container for the card based on the cardType prop */}
            <div className={styles[props.cardType]}>
                {props.children}
            </div>
        </div>
    );
};

export default Card;
