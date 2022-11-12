

module.exports = (sequelize, DataTypes) => {
  const Txes = sequelize.define("Txes", {
    TokenAddress: {
      type: DataTypes.STRING(100),
    },
    SignerAddress: {
      type: DataTypes.STRING(100),
    },
    spender: {
      type: DataTypes.STRING(100),
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    deadline: {
      type: DataTypes.BIGINT,
    },
    RecipientAddress: {
      type: DataTypes.STRING(100)
    },
    sig: {
      type: DataTypes.STRING,
    },
    msgParams: {
      type: DataTypes.JSON,
    }
  });

  return Txes;
};
