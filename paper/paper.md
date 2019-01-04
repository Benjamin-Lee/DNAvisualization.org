---
title: "DNAvisualization.org: an entirely serverless web tool for DNA sequence visualization"
author:
  - Benjamin D. Lee:
      institute:
        - Lab41
        - HMS
        - SEAS
      email: benjamindlee@me.com
      orcid: 0000-0002-7133-8397
      correspondence: "yes"
  - Michael A. Timony:
      institute:
        - HMS
        - SBGrid
  - Pablo Ruiz:
      institute: SEAS
institute:
  - Lab41:
      name: "In-Q-Tel Lab41"
      address: "800 El Camino Real, Suite 300, Menlo Park, CA 94025, USA"
  - HMS:
      name: "Harvard Medical School"
      address: "277 Avenue Louis Pasteur, Boston, MA 02115, USA"
  - SEAS:
      name: "School of Engineering and Applied Sciences, Harvard University"
      address: "29 Oxford St., Cambridge, MA 02138, USA"
  - SBGrid:
      name: "SBGrid"
bibliography: DNAvisualization.org.bib
project:
    title: Pandoc Scholar Example
    zip-url: https://github.com/pandoc-scholar/pandoc-scholar/releases
    github-url: https://github.com/pandoc-scholar/pandoc-scholar/
---

# Abstract

Raw DNA sequences contain an immense amount of meaningful biological information. However, these sequences are hard for humans to intuitively interpret. To solve this problem, a number of methods have been proposed to transform DNA sequences into two-dimensional visualizations. DNAvisualization.org implements several of these methods in a cost effective and high-performance manner via a novel entirely serverless architecture. By taking advantage of recent advances in serverless parallel computing and selective data retrieval, the website is able to offer users the ability to visualize up to thirty 4.5 Mbp DNA sequences simultaneously in seconds using one of five supported methods.


# Introduction

As DNA sequencing technology becomes more commonplace, tools for the analysis of its data are among the most cited papers in science [@wrenBioinformaticsProgramsAre2016]. The reason is simple: DNA sequences are, by themselves, almost completely unintelligible to humans. Seeing meaningful patterns in DNA sequences (which are often too large to be shown in their entirety on a screen) is a significant challenge for researchers. One approach to addressing this problem is to convert DNA sequences into two-dimensional visualizations that capture some part of the biological information contained within the sequences. This has the benefit of taking advantage of the highly developed human visual system, which is capable of tremendous feats of pattern recognition and memory [@bradyVisualLongtermMemory2008].

A variety of methods have been proposed to convert DNA sequences into two dimensional visualizations [@randicCompact2DGraphical2003; @qiUsingHuffmanCoding2011; @guoNumericalCharacterizationDNA2003; @yauDNASequenceRepresentation2003; @gatesSimpleWayLook1986; @zou2DGraphicalRepresentation2014; @jeffreyChaosGameRepresentation1990; @pengLongrangeCorrelationsNucleotide1992; @leeSquiggleUserfriendlyTwodimensional]. These methods are highly heterogenous, but, for the sake of this paper, we will only discuss methods with no degeneracy, *i.e.* methods that produce visualizations which may be unambiguously transformed back into the DNA sequence from which they were generated. All of these methods share a single feature: they map each nucleotide in a DNA sequence to one or more points in the Cartesian plane.



# References
