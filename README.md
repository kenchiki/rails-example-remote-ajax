# indexにフォームを設置してajaxで送信してバリデーションエラーを表示し、成功ならリダイレクトする
- 記事にコメントを投稿するような場合に効果的
- 編集を作るのは大変なので、削除だけできれば良い

## 導入までの手順
- Gemfileに`gem 'webpacker', '~> 3.5'`を追記してbundle install
- `brew install yarn`でyarn導入
- `bundle exec rails webpacker:install`
- `bundle exec rails webpacker:install:vue`

上記のコマンドにより`app/javascript/packs`にhello worldファイルが作成される。
ちなみに`rails-example-vue-crud\config\webpacker.yml`に`app/javascript/packs`に
vueファイルを作るように書いているのが分かる

- sshで`ruby ./bin/webpack-dev-server`
- hamlの表示したい箇所に`= javascript_pack_tag 'hello_vue'`

## remote: trueのイベントをvueで拾う

```ruby
# controllers/articles_controller.rb

# javascript/packs/modules/article_new.jsがJSONを受け取ってDOMを生成する
# status: :unprocessable_entityで422が返り、ajax:errorのイベントを捕捉する（remote: trueの仕様）
render json: @article.errors.full_messages, status: :unprocessable_entity
```

```haml
-# articles/_form.html.haml

-# 下記のフォームはid="new_article"が割り当てられる
= simple_form_for(@article, remote: true, html: {'v-on:ajax:error': 'errors_show'} ) do |f|
```

```javascript
// javascript/packs/modules/article_new.js

methods: {
  errors_show: function (event) {
    this.errors = event.detail[0];
    // event.target.querySelector('#article_title').style.backgroundColor = '#ff0000';のようにevent.targetでid="new_article"のDOMのスコープを拾うことができる
  }
}
```

## 自動でJSを読み込む

```javascript
// javascript/packs/application.js

document.addEventListener('turbolinks:load', () => {
  function allRequire(context) {
    context.keys().forEach(function (value) {
      let obj = context(value);
      obj.default(Vue)
    });
  }
  allRequire(require.context('./modules/', false, /\.js$/))
})
```

## turbolinksとvueを同時に使う

### 下記のライブラリが必要になる
- `yarn add 'vue-turbolinks'`

```javascript
import TurbolinksAdapter from 'vue-turbolinks';
Vue.use(TurbolinksAdapter)
```

### 参考
- vue導入時に生成される`hello_vue.vue`にコメントとしてvue-turbolinksのことが記載されているので見る
- [https://github.com/jeffreyguenther/vue-turbolinks](https://github.com/jeffreyguenther/vue-turbolinks)
