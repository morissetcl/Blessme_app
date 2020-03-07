import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';

class Tabs extends React.Component {
  // Initialize State
  state = { activeTab: 0 }

  render({ children } = this.props) {
    return (
      <View style={styles.container}>
        {/* Tabs row */}
        <View style={styles.tabsContainer}>
          {/* Pull props out of children, and pull title out of props */}
          {children.map(({ props: { title } }, index) =>
            <TouchableOpacity
              style={[
                // Default style for every tab
                styles.tabContainer,
                // Merge default style with styles.tabContainerActive for active tab
                index === this.state.activeTab ? styles.tabContainerActive : [],
              ]}
              // Change active tab
              onPress={() => this.setState({ activeTab: index }) }
              // Required key prop for components generated returned by map iterator
              key={index}
            >
              <Text style={styles.tabText}>
                {title}
              </Text>
            </TouchableOpacity>,
          )}
        </View>
        {/* Content */}
        <View style={styles.contentContainer}>
          {children[this.state.activeTab]}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Component container
  container: {
    flex: 1,
  },
  // Tabs row container
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 30,
  },
  // Individual tab container
  tabContainer: {
    flex: 1,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#eaeaea',

  },
  // Active tab container
  tabContainerActive: {
    borderBottomColor: '#49beb7',
  },
  // Tab text
  tabText: {
    color: '#444444',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Content container
  contentContainer: {
    flex: 1,
  },
});

export default Tabs;
