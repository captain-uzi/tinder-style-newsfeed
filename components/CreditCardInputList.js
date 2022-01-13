import React, { useState } from "react";
import styled from "styled-components";
import { Text, TouchableOpacity, View } from "react-native";
import calendar from "../utils/calendar";
import CreditCardInput from "./CreditCardInput";

const CreditCardInputList = ({ cards = [], changeSelection }) => {
  const [selectedCards, setSelectedCards] = useState([]);

  return (
    <Container>
      <CardsList horizontal showsHorizontalScrollIndicator={false}>
        {/* <CreditCardInput onAddCard={() => true} /> */}

        {cards.map((card) => (
          <CreditCardInput
            key={card.id}
            card={card}
            primary={card.type === "VISA"}
            onChangeCard={(card, notselected) => {
              if (notselected === false) {
                let arr = selectedCards;
                arr.push(card);
                setSelectedCards(arr);
              }
              if (notselected === true) {
                let arr = selectedCards;
                arr.pop(card);
                setSelectedCards(arr);
              }
              changeSelection(selectedCards);
            }}
          />
        ))}
      </CardsList>
    </Container>
  );
};

const Container = styled.View`
  ${({ theme: { space } }) => ({
    marginTop: 14,
    marginLeft: 24,
    height: calendar.CDCARD_HEIGHT + 32,
  })}
`;

const CardsList = styled.ScrollView``;

export default CreditCardInputList;
