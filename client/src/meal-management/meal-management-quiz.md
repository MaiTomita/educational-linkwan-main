# Meal Managementの実装に基づくReactの概念クイズ

### 1) カレンダー画面で骨アイコンをクリックして食事管理画面に遷移するために、最も直接的に使った概念はどれ？
1. useMemo
2. useNavigate + onClickイベントハンドラ
3. Context.Provider
4. useRef

正解: 2

### 2) Appで`/meal-management`ルートを接続する時、中心となる記述はどれ？
1. `<Route path="/meal-management" element={<MealManagementPage />} />`
2. `useEffect(() => navigate('/meal-management'))`
3. `window.location.hash = '/meal-management'`
4. `ReactDOM.render(MealManagementPage)`

正解: 1

### 3) 食事カード一覧を`meals.map(...)`で描画した理由として最も適切なのはどれ？
1. CSSアニメーションを自動適用するため
2. 配列データをもとに反復UIを宣言的に作るため
3. ルーターの性能を上げるため
4. ブラウザメモリを強制的に減らすため

正解: 2

- 宣言的：meals.map(...) を使用して、「この配列の各要素をこのように画面に表示する」と宣言するだけ。ループや DOM の操作などは React が自動的に処理する。

- 命令的：for ループや document.createElement などを使用して、「どのようにループし、どのように DOM を作成し、どこに配置するか」まで、一つひとつ直接指示する。

### 4) 食事詳細がある場合のみ `{meal.details.length > 0 && (...)}` で表示するのはどのパターン？
1. 高階コンポーネント(HOC)
2. コードスプリッティング
3. 条件付きレンダリング
4. イベントバブリング

正解: 3

### 5) 食事管理画面とカレンダー画面でスタイルを分離した主な利点は？
1. 画像容量の自動最適化
2. 画面間のスタイル衝突を減らし、保守性を上げる
3. APIリクエスト回数を減らす
4. ブラウザタブ数を減らす

正解: 2
