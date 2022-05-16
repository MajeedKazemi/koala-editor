
const chai = require('chai')
const expect = chai.expect

const helperModule = require('../dist/playground_helper.js')

describe('#1 Missing Colon', () => {
	describe('1.1 Regular, true cases', () => {
		it('1.1.1 for loop', () => {
			expect(helperModule.checkMissingColon("for i in range(10)")).to.equal(18)
		})
		it('1.1.2 while loop', () => {
			expect(helperModule.checkMissingColon("while True")).to.equal(10)
		})
	})

	describe('1.2 Regular, false cases', () => {
		it('1.2.1 function def', () => {
			expect(helperModule.checkMissingColon("def multiply(n,b):")).to.equal(-1)
		})
		it('1.2.2 if statement', () => {
			expect(helperModule.checkMissingColon("if a[1:3] == b:")).to.equal(-1)
		})

	})

	describe('1.3 Abnormal, true cases', () => {
		it('1.3.1 preceding whitespace', () => {
			expect(helperModule.checkMissingColon("  if a #comments")).to.equal(6)
		})
		it('1.3.2 colon in comment', () => {
			expect(helperModule.checkMissingColon("if a[1:3] == b #this colon is useless:")).to.equal(14)
		})

	})

	describe('1.4 Abnormal, false cases', () => {
		it('1.4.1 keyword in string', () => {
			expect(helperModule.checkMissingColon("a = \"for i in range\"")).to.equal(-1)
		})
		it('1.4.2 keyword as variable name', () => {
			expect(helperModule.checkMissingColon("a = while.split()")).to.equal(-1)
		})

	})
})

// npx mocha test