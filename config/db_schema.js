module.exports = {
  tables: [
    {
      table_name: 'tbl_Company',
      columns: [
        {
          column_name: 'name',
          type: 'string',
          unique: true,
          required: true
        },
        {
          column_name: 'description',
          type: 'string',
          default: ''
        }
      ]
    },
    {
      table_name: 'tbl_User',
      columns: [
        {
          column_name: 'email',
          type: 'string',
          required: true,
          index: true
        },
        {
          column_name: 'first_name',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'last_name',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'role',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'company_id',
          type: 'uuid',
          foreign_key: true,
          reference_table: 'tbl_Company',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        }
      ]
    },
    {
      table_name: 'tbl_UserAuth',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'tbl_User',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'password',
          type: 'string',
          default: '',
          required: true
        },
        {
          column_name: 'salt',
          type: 'string',
          required: true
        }
      ]
    },
    {
      table_name: 'tbl_UserSession',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'tbl_User',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'status',
          type: 'string',
          default: 'Online',
          required: true
        },
        {
          column_name: 'device_type',
          type: 'string',
          default: 'Web',
          required: true
        }
      ]
    },
    {
      table_name: 'tbl_Experience',
      columns: [
        {
          column_name: 'position',
          type: 'string',
          required: true
        },
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'tbl_User',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'company',
          type: 'string',
          required: true
        },
        {
          column_name: 'start_date',
          type: 'datetime',
          required: true
        },
        {
          column_name: 'end_date',
          type: 'datetime'
        }
      ]
    }
  ]
}
