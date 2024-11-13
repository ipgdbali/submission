/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

const ThreadRepository = require('../Domains/thread/ThreadRepository');
const ThreadRepositoryPostgres = require('../Infrastructures/repository/ThreadRepositoryPostgres');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');

const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../Applications/use_case/AddThreadCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteThreadCommentUseCase');
const GetThreadDetailUseCase = require('../Applications/use_case/GetThreadDetailUseCase');
const AddReplyUseCase = require('../Applications/use_case/AddThreadCommentReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteThreadCommentReplyUseCase');
const LikeUnlikeThreadsCommentUseCase = require('../Applications/use_case/LikeUnlikeThreadsCommentUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key : UserRepository.name,
    Class : UserRepositoryPostgres,
    parameter : {
      dependencies : [
        {
          concrete : pool,
        },
        {
          concrete : nanoid,
        },
      ],
    },
  },
  {
    key : AuthenticationRepository.name,
    Class : AuthenticationRepositoryPostgres,
    parameter : {
      dependencies : [
        {
          concrete : pool,
        },
      ],
    },
  },
  {
    key : PasswordHash.name,
    Class : BcryptPasswordHash,
    parameter : {
      dependencies : [
        {
          concrete : bcrypt,
        },
      ],
    },
  },
  {
    key : AuthenticationTokenManager.name,
    Class : JwtTokenManager,
    parameter : {
      dependencies : [
        {
          concrete : Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key : AddUserUseCase.name,
    Class : AddUserUseCase,
    parameter : {
      injectType : 'destructuring',
      dependencies : [
        {
          name : 'userRepository',
          internal : UserRepository.name,
        },
        {
          name : 'passwordHash',
          internal : PasswordHash.name,
        },
      ],
    },
  },
  {
    key : LoginUserUseCase.name,
    Class : LoginUserUseCase,
    parameter : {
      injectType : 'destructuring',
      dependencies : [
        {
          name : 'userRepository',
          internal : UserRepository.name,
        },
        {
          name : 'authenticationRepository',
          internal : AuthenticationRepository.name,
        },
        {
          name : 'authenticationTokenManager',
          internal : AuthenticationTokenManager.name,
        },
        {
          name : 'passwordHash',
          internal : PasswordHash.name,
        },
      ],
    },
  },
  {
    key : LogoutUserUseCase.name,
    Class : LogoutUserUseCase,
    parameter : {
      injectType : 'destructuring',
      dependencies : [
        {
          name : 'authenticationRepository',
          internal : AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key : RefreshAuthenticationUseCase.name,
    Class : RefreshAuthenticationUseCase,
    parameter : {
      injectType : 'destructuring',
      dependencies : [
        {
          name : 'authenticationRepository',
          internal : AuthenticationRepository.name,
        },
        {
          name : 'authenticationTokenManager',
          internal : AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key : ThreadRepository.name,
    Class : ThreadRepositoryPostgres,
    parameter : {
      dependencies : [
        {
          concrete : pool,
        }
      ]
    }
  },
  {
    key : AddThreadUseCase.name,
    Class : AddThreadUseCase,
    parameter : {
      dependencies : [
        {
          name : 'threadRepository',
          internal : ThreadRepository.name
        }, {
          concrete : nanoid
        }
      ]
    }
  },
  {
    key : AddCommentUseCase.name,
    Class : AddCommentUseCase,
    parameter : {
      dependencies : [
        {
          name : 'threadRepository',
          internal : ThreadRepository.name
        }, {
          concrete : nanoid
        }
      ]
    }
  },
  {
    key : GetThreadDetailUseCase.name,
    Class : GetThreadDetailUseCase,
    parameter : {
      dependencies : [
        {
          name : 'threadRepository',
          internal : ThreadRepository.name
        }
      ]
    }
  },
  {
    key : DeleteCommentUseCase.name,
    Class : DeleteCommentUseCase,
    parameter : {
      dependencies : [
        {
          name : 'threadRepository',
          internal : ThreadRepository.name
        }
      ]
    }    
  },
  {
    key : AddReplyUseCase.name,
    Class : AddReplyUseCase,
    parameter : {
      dependencies : [
        {
          name : 'threadRepository',
          internal : ThreadRepository.name
        }, {
          concrete : nanoid
        }
      ]
    }
  }, {
    key : DeleteReplyUseCase.name,
    Class : DeleteReplyUseCase,
    parameter : {
      dependencies : [
        {
          name : 'threadRepository',
          internal : ThreadRepository.name
        }
      ]
    }
  }, {
    key : LikeUnlikeThreadsCommentUseCase.name,
    Class : LikeUnlikeThreadsCommentUseCase,
    parameter : {
      dependencies : [
        {
          name : 'threadRepository',
          internal : ThreadRepository.name
        }
      ]
    }    
  }
]);

module.exports = container;
