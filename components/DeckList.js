import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, ScrollView, AlertIOS } from 'react-native'
import { white, gray, darkBlue, darkGray } from '../utils/colors'
import { getDecks, saveDeckTitle, removeDeck, truncateText } from '../utils/helpers'
import { Entypo } from '@expo/vector-icons'
import DeckListRow from './DeckListRow'
import TextButton from './TextButton'

class DeckList extends Component {


  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: "Decks"
    }
  }

  state = {
    decks: {}
  }

  refreshDecks = () => {
    getDecks().then((decks) => this.setState({decks}))
  }

  componentWillMount() {
    this.refreshDecks()
  }

  addDeckToState = (deck) => {
    this.setState((state) => ({
      decks: {
        ...state['decks'],
        deck
      }
    }))
  }

  addDeck = (title) => {
    const deck = {
      title,
      questions: []
    }
    this.addDeckToState(deck)
    saveDeckTitle(title)
    this.props.navigation.navigate('Deck', {deck})
  }

  removeDeckFromState = (title) => {
    this.setState((state) => {
      delete state['decks'][title]

      return {
        ...state
      }

    })
  }

  removeDeck = (title) => {
    this.removeDeckFromState(title)
    removeDeck(title)
  }

  openAlert = () => {
    AlertIOS.prompt(
      'Enter new deck title',
      null,
      text => this.addDeck(text)
    )
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container}>
            { this.state.decks ? (
              Object.keys(this.state.decks).map((key) => {
                return (
                  <DeckListRow key={key} deck={this.state.decks[key]} navigate={this.props.navigation.navigate}
                  removeDeck={this.removeDeck} refreshDecks={this.refreshDecks} />
                )
              })
            ) : (
              <View>
                <Text style={styles.title}>No decks found</Text>
              </View>
            )}


          </ScrollView>
          <View style={styles.tabBar}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <TouchableHighlight onPress={() => { this.openAlert()}}>
                <Text style={{ color: darkBlue, textAlign: 'right', fontSize: 18}}>Add Deck</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
    )
  }
}

export default DeckList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray
  },
  deck: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: white,
    borderBottomWidth: 1,
    borderColor: gray,
    padding: 15,
    flexShrink: 0,
    transform: [{translateX: -100}]
  },
  title: {
    fontSize: 24,
  },
  modal: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 150,
    height: 150,
    backgroundColor: darkBlue
  },
  count: {
    fontSize: 24,
    textAlign: 'right',
    color: darkGray
  },
  tabBar: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: white,
    padding: 10,
    paddingTop: 18,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderColor: darkGray
  }
})
