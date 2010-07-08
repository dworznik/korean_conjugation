// vim: set ts=4 sw=4 expandtab
// (C) 2010 Dan Bravender - licensed under the AGPL 3.0

try {
    var hangeul    = require('./hangeul'),
        conjugator = require('./pronunciation');
} catch(e) {}

var stemmer = {};

stemmer.iterate_chop_last = function(s):
    for i in reversed(range(1, len(s))):
        yield s[0:-i]
    yield s

def generate_stems(verb):
    if verb[-1] == u'해':
        yield (False, verb[:-1] + u'하')
    if vowel(verb[-1]) == u'ㅕ':
        yield (False, verb[:-1] + join(lead(verb[-1]), u'ㅣ'))
    if vowel(verb[-1]) == u'ㅐ':
        yield (False, verb[:-1] + join(lead(verb[-1]), vowel(find_vowel_to_append(verb[:-1])), u'ᇂ'))
    yield (False, verb[:-1] + join(lead(verb[-1]), u'ㅡ'))
    yield (True, verb)
    for p in [u'ᆮ', u'ᆸ',u'ᆯ', u'ᆺ', u'ᄂ']:
        yield (False, verb[:-1] + join(lead(verb[-1]), vowel(verb[-1]), p))
    yield (False, verb[:-1] + join(lead(verb[-1]), vowel(verb[-1])))

def stem(verb):
    # remove all conjugators that return what was passed in
    ignore_indicies = [i for (i, conj) in \
                       enumerate(conjugation.perform('test')) \
                       if conj[1] == 'test']
    for possible_base_stem in iterate_chop_last(verb):
        for (original, possible_stem) in generate_stems(possible_base_stem):
            if verb in [x[1] for (i, x) in \
                        enumerate(conjugation.perform(possible_stem)) \
                        if (i not in ignore_indicies) or not original]:
                return possible_stem + u'다'
