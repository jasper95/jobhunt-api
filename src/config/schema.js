module.exports = {
  tables: [
    {
      table_name: 'company',
      slug: true,
      columns: [
        {
          column_name: 'name',
          type: 'string',
          unique: true,
          required: true
        },
        {
          column_name: 'avatar',
          type: 'string',
          default: ''
        },
        {
          column_name: 'description',
          type: 'jsonb',
          default: '{}'
        },
        {
          column_name: 'email',
          type: 'string',
          default: '',
          required: true
        },
        {
          column_name: 'contact_number',
          type: 'string',
          default: ''
        }
      ]
    },
    {
      table_name: 'system_user',
      columns: [
        {
          column_name: 'email',
          type: 'string',
          required: true,
          index: true
        },
        {
          column_name: 'slug',
          type: 'string',
          required: true,
          unique: true,
          index: true
        },
        {
          column_name: 'province',
          type: 'string'
        },
        {
          column_name: 'municipality',
          type: 'string'
        },
        {
          column_name: 'address_description',
          type: 'jsonb',
          default: '{}'
        },
        {
          column_name: 'barangay',
          type: 'string'
        },
        {
          column_name: 'verified',
          type: 'boolean',
          default: false
        },
        {
          column_name: 'resume',
          type: 'string',
          default: ''
        },
        {
          column_name: 'avatar',
          type: 'string',
          default: ''
        },
        {
          column_name: 'first_name',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'contact_number',
          type: 'string',
          // required: true,
          default: ''
        },
        {
          column_name: 'birth_date',
          type: 'timestamp',
          type_params: [{ useTz: true }]
        },
        {
          column_name: 'address',
          type: 'string',
          default: ''
        },
        {
          column_name: 'nationality',
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
          reference_table: 'company',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        }
      ]
    },
    {
      table_name: 'user_auth',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'system_user',
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
      table_name: 'user_session',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'system_user',
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
      table_name: 'experience',
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
          reference_table: 'system_user',
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
          type: 'timestamp',
          type_params: [{ useTz: true }],
          required: true
        },
        {
          column_name: 'end_date',
          type: 'timestamp',
          type_params: [{ useTz: true }]
        }
      ]
    },
    {
      table_name: 'skill',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'system_user',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'name',
          type: 'string',
          required: true
        },
        {
          column_name: 'level',
          type: 'integer',
          required: true
        }
      ]
    },
    {
      table_name: 'job_category',
      columns: [
        {
          column_name: 'name',
          type: 'string',
          required: true
        }
      ]
    },
    {
      table_name: 'education',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'system_user',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'job_category_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'job_category',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'qualification',
          type: 'string',
          required: true
        },
        {
          column_name: 'school',
          type: 'string',
          required: true
        },
        {
          column_name: 'start_date',
          type: 'timestamp',
          type_params: [{ useTz: true }],
          required: true
        },
        {
          column_name: 'end_date',
          type: 'timestamp',
          type_params: [{ useTz: true }]
        }
      ]
    },
    {
      table_name: 'job',
      slug: true,
      columns: [
        {
          column_name: 'company_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'company',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'name',
          type: 'string',
          required: true
        },
        {
          column_name: 'status',
          type: 'string',
          default: 'Active'
        },
        {
          column_name: 'province',
          type: 'string',
          required: true
        },
        {
          column_name: 'municipality',
          type: 'string',
          required: true
        },
        {
          column_name: 'address_description',
          type: 'jsonb',
          default: '{}'
        },
        {
          column_name: 'barangay',
          type: 'string',
          required: true
        },
        {
          column_name: 'street',
          type: 'string',
          default: ''
        },
        {
          column_name: 'description',
          type: 'jsonb',
          required: true
        },
        {
          column_name: 'skills',
          type: 'jsonb',
          default: '[]'
        },
        {
          column_name: 'job_category_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'job_category',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'end_date',
          type: 'timestamp',
          type_params: [{ useTz: true }],
          required: true
        }
      ]
    },
    {
      table_name: 'application',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'system_user',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'job_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'job',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'company_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'company',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'status',
          type: 'string',
          default: 'pending'
        },
        {
          column_name: 'pitch',
          type: 'string',
          required: true
        }
      ]
    },
    {
      table_name: 'notification',
      columns: [
        {
          column_name: 'user_id',
          type: 'uuid',
          foreign_key: true,
          required: true,
          reference_table: 'system_user',
          reference_column: 'id',
          on_update: 'CASCADE',
          on_delete: 'RESTRICT'
        },
        {
          column_name: 'body',
          type: 'jsonb',
          default: '{}'
        },
        {
          column_name: 'status',
          type: 'string',
          required: true
        }
      ]
    }
  ]
}
