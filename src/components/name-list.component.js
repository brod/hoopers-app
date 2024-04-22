import React from 'react';
import PropTypes from 'prop-types';

const NameList = ({ names }) => {
  const renderColumns = () => {
    const columnCount = Math.ceil(names.length / 5);
    const columns = [];

    for (let i = 0; i < columnCount; i++) {
      const columnNames = names.slice(i * 5, (i + 1) * 5);
      columns.push(
        <div className="column" key={i}>
          <ul>
            {columnNames.map((player) => (
              <li key={player.id}>
                {player.name}: {player.gamesPlayed}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return columns;
  };

  return <div className="name-list">{renderColumns()}</div>;
};

NameList.propTypes = {
  names: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      gamesPlayed: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default NameList;